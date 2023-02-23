export {};

type ItemProps = {
  title: string;
  value: `${number}.${number}`;
  quantity?: number;
  include?: string[];
  isShared?: boolean;
  selectAll?: boolean;
};

const addItem = ({
  title,
  value,
  quantity = 1,
  isShared = false,
  selectAll = false,
}: ItemProps) => {
  cy.dataCy("addInputTitle").type(title);
  cy.dataCy("addInputValue").type(value);
  cy.dataCy("addInputQuantity").type(quantity.toString());
  if (isShared) {
    cy.dataCy("sharedSelect").click();
  }
  if (selectAll) {
    cy.dataCy("selectAll").click();
  }
};

describe("JaJaJa", () => {
  it("passes", () => {
    cy.viewport("macbook-16");
    cy.visit("http://localhost:3000");
    cy.get("input[name='title']").as("titleInput").should("exist");
    cy.get("@titleInput").type("JaJaJa");
    cy.dataCy("addItemButton").as("addItemButton");
    cy.get("#People").as("peopleSection");
    cy.get("@peopleSection").should("exist");
    cy.get("@peopleSection")
      .get("button[name='increase']")
      .as("increaseButton");
    cy.get("@increaseButton").click().click().click().click();
    cy.get("input[name='name']").should("have.length", 4);
    cy.dataCy("person-0").type("Nathan Sorkin");
    cy.dataCy("person-1").type("Emily Prusak");
    cy.dataCy("person-2").type("Sarah Longnecker");
    cy.dataCy("person-3").type("Jordan Longnecker");
    cy.get("input[name='name']").should("have.length", 4);
    cy.dataCy("addItemButton").as("addItemButton");
    cy.get("@addItemButton").click();
    cy.dataCy("addInputTitle").type("Quesadilla");
    cy.dataCy("addInputValue").type("14.00");
    cy.contains("Nathan Sorkin").click();
    cy.dataCy("item-submit").click();
    cy.get("@addItemButton").click();
    cy.dataCy("addInputTitle").type("Chorizo Burrito");
    cy.dataCy("addInputValue").type("15.00");
    cy.contains("Emily Prusak").click();
    cy.dataCy("item-submit").click();
    cy.get("@addItemButton").click();
    cy.dataCy("addInputTitle").type("Pollo Burrito");
    cy.dataCy("addInputValue").type("18.00");
    cy.contains("Sarah Longnecker").click();
    cy.dataCy("item-submit").click();
    cy.get("@addItemButton").click();
    cy.dataCy("addInputTitle").type("Tacos");
    cy.dataCy("addInputValue").type("10.00");
    cy.contains("Jordan Longnecker").click();
    cy.dataCy("item-submit").click();
    cy.get("@addItemButton").click();
    cy.dataCy("addInputTitle").type("Nachos");
    cy.dataCy("addInputValue").type("18.00");
    cy.dataCy("sharedSelect").click();
    cy.dataCy("selectAll").click();
    cy.dataCy("item-submit").click();
    cy.dataCy("taxInput").type("6.66");
    cy.dataCy("tipInput").type("16.34");
    cy.dataCy("grossTotal").should("have.text", "$98.00");
  });
});
describe("Bearded Lady", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000");
    cy.get("input[name='title']").as("titleInput").should("exist");
    cy.get("@titleInput").type("Bearded Lady");
    cy.dataCy("addItemButton").as("addItemButton");
    cy.get("#People").as("peopleSection");
    cy.get("@peopleSection").should("exist");
    cy.get("@peopleSection")
      .get("button[name='increase']")
      .as("increaseButton");
    cy.get("@increaseButton").click().click().click().click();

    cy.get("input[name='name']").should("have.length", 4);

    cy.dataCy("person-0").type("Nathan Sorkin");
    cy.dataCy("person-1").type("Emily Prusak");
    cy.dataCy("person-2").type("Dane Galbraith");
    cy.dataCy("person-3").type("Abbey Heslep");
    cy.dataCy("addItemButton").as("addItemButton");

    cy.get("@addItemButton").click();

    cy.dataCy("addInputTitle").as("title");
    cy.dataCy("addInputValue").as("value");
    cy.dataCy("item-submit").as("submit");
    cy.dataCy("addInputQuantity").as("quantity");
    cy.dataCy("sharedSelect").as("shared");

    cy.get("@title").type("Burning Bush");
    cy.get("@value").type("14.00");
    cy.contains("Abbey Heslep").click();
    cy.dataCy("item-submit").click();

    cy.get("@addItemButton").click();

    cy.get("@title").type("Shacksbury Cider");
    cy.get("@value").type("7.00");
    cy.contains("Emily Prusak").click();
    cy.dataCy("item-submit").click();

    cy.get("@addItemButton").click();

    cy.get("@title").type("IPA");
    cy.get("@value").type("8.00");
    cy.contains("Nathan Sorkin").click();
    cy.dataCy("item-submit").click();

    cy.get("@addItemButton").click();

    cy.get("@title").type("Mojito");
    cy.get("@value").type("12.00");
    cy.contains("Dane Galbraith").click();
    cy.dataCy("item-submit").click();

    cy.get("@addItemButton").click();

    cy.get("@title").type("Veggie Dog");
    cy.get("@value").type("6.00");
    cy.get("@quantity").type("2");
    cy.contains("Emily Prusak").click();
    cy.contains("Nathan Sorkin").click();
    cy.dataCy("item-submit").click();

    cy.get("@addItemButton").click();

    cy.get("@title").type("Grilled Cheese");
    cy.get("@value").type("6.00");
    cy.get("@quantity").type("2");
    cy.contains("Dane Galbraith").click();
    cy.contains("Abbey Heslep").click();
    cy.dataCy("item-submit").click();

    cy.get("@addItemButton").click();

    cy.get("@title").type("Pickles");
    cy.get("@value").type("2.00");
    cy.get("@shared").click();
    cy.contains("Emily Prusak").click();
    cy.contains("Nathan Sorkin").click();
    cy.dataCy("item-submit").click();

    cy.get("@addItemButton").click();

    cy.get("@title").type("Rum & Coke");
    cy.get("@value").type("10.00");
    cy.contains("Dane Galbraith").click();
    cy.dataCy("item-submit").click();

    cy.dataCy("taxInput").type("6.83");
    cy.dataCy("tipInput").type("18.00");
    cy.dataCy("grossTotal").should("have.text", "$101.83");
  });
});
