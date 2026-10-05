import { describe, it, expect } from "vitest";
import { compareListings, extractContacts, findDuplicates, nameSimilarity } from "@/data/duplicateCheck";

const listing = (name: string, contactText = "", location = "", region: string | null = null) => ({
  name, contactText, location, region,
});

describe("extractContacts", () => {
  it("pulls out emails, website domains, social profiles and phone numbers from one cell", () => {
    const c = extractContacts(
      "Hello@BrightSteps.co.uk | +44 (0)7700 900000 | https://www.brightsteps.co.uk/contact | facebook.com/BrightStepsTherapy",
    );
    expect(c.emails).toEqual(["hello@brightsteps.co.uk"]);
    expect(c.domains).toContain("brightsteps.co.uk");
    expect(c.socials).toEqual(["facebook.com/brightstepstherapy"]);
    expect(c.phones.length).toBe(1);
  });

  it("treats UK phone formats as the same number", () => {
    expect(extractContacts("07700 900000").phones).toEqual(extractContacts("+44 7700 900000").phones);
    expect(extractContacts("0044-7700-900-000").phones).toEqual(extractContacts("07700900000").phones);
  });

  it("ignores free email and shared hosts as a website", () => {
    expect(extractContacts("someone@gmail.com").domains).toEqual([]);
    expect(extractContacts("https://linktr.ee/club").domains).toEqual([]);
  });
});

describe("nameSimilarity", () => {
  it("ignores capitals, spaces, punctuation and business suffixes", () => {
    expect(nameSimilarity("The Bright-Minds Speech Therapy Ltd", "brightminds speech therapy")).toBe(1);
    expect(nameSimilarity("Smith & Co Tutoring", "Smith and Co. Tutoring Limited")).toBe(1);
    expect(nameSimilarity("Sarah's Sensory Club", "Sarahs Sensory Club")).toBe(1);
  });

  it("scores typos and reordered words highly", () => {
    expect(nameSimilarity("Splash Swiming Club", "Splash Swimming Club")).toBeGreaterThan(0.9);
    expect(nameSimilarity("Therapy Bright Minds", "Bright Minds Therapy")).toBe(1);
    expect(nameSimilarity("Splash Swimming", "Splash Inclusive Swimming")).toBeGreaterThanOrEqual(0.85);
  });

  it("does not match different businesses", () => {
    expect(nameSimilarity("Bright Minds Speech Therapy", "Little Owls Forest School")).toBeLessThan(0.5);
    expect(nameSimilarity("ABC", "ABD")).toBe(0);
  });
});

describe("compareListings", () => {
  it("is definite when the website, email or phone match — whatever the name", () => {
    expect(compareListings(listing("Totally Different", "www.brightsteps.co.uk"), listing("Bright Steps", "https://brightsteps.co.uk/"))?.level).toBe("definite");
    expect(compareListings(listing("A Club", "07700 900000"), listing("B Group", "+44 7700 900000"))?.level).toBe("definite");
  });

  it("is definite for the same name in the same town", () => {
    expect(compareListings(listing("Bright Steps Ltd", "", "Bristol, South West"), listing("bright steps", "", "Bristol"))?.level).toBe("definite");
  });

  it("is likely for a typo in the same region, possible with no shared area", () => {
    expect(compareListings(listing("Splash Swiming Club", "", "Bath", "South West"), listing("Splash Swimming Club", "", "Bristol", "South West England"))?.level).toBe("likely");
    expect(compareListings(listing("Splash Swiming Club", "", "Leeds"), listing("Splash Swimming Club", "", "Bristol"))?.level).toBe("possible");
  });

  it("does not flag unrelated listings or a shared free email host", () => {
    expect(compareListings(listing("Bright Minds", "a@gmail.com", "Bristol"), listing("Little Owls", "b@gmail.com", "Bristol"))).toBeNull();
  });
});

describe("findDuplicates", () => {
  it("checks against existing listings and earlier rows of the same file", () => {
    const existing = [{ id: "p1", ...listing("Bright Steps Therapy", "brightsteps.co.uk", "Bristol") }];
    const rows = [
      listing("Bright Steps Therapy Ltd", "", "Bristol"),
      listing("Little Owls", "owls@littleowls.org", "Leeds"),
      listing("Little Owls CIC", "info@littleowls.org", "Leeds"),
      listing("Brand New Club", "new@newclub.org", "York"),
    ];
    const res = findDuplicates(rows, existing);
    expect(res[0]).toMatchObject({ level: "definite", targetId: "p1", source: "existing" });
    expect(res[1]).toBeNull();
    expect(res[2]).toMatchObject({ level: "definite", targetId: "row-1", source: "file" });
    expect(res[3]).toBeNull();
  });
});
