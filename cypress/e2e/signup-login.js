/// <reference types="cypress"/> 

describe('Signup and Login', () => {

    let randomString = Math.random().toString(36).substring(2);
    let userNmae = "Auto" + randomString;
    let email = "auto_email" + randomString + "@example.com";
    const password = "Password1";

    it('Test valid Signup', () => {
        //https://api.realworld.io/api/users
        cy.intercept("POST", "**/*.realworld.io/api/users").as("newUser");

        cy.visit("http://localhost:4200/")

        cy.get(".nav ").contains("Sign up").click();

        cy.get("[placeholder='Username']").type(userNmae);
        cy.get("[placeholder='Email']").type(email);
        cy.get("[placeholder='Password']").type(password);

        cy.get("button").contains("Sign up").click();

        //assertion
        cy.get(':nth-child(4) > .nav-link').contains(userNmae);

        // Here should () does not wirked and returned with error and recommentdation of using then()
        //Error message from Cypress log - cy.should() failed because you invoked a command inside the callback. cy.should() retries the inner function, which would result in commands being added to the queue multiple times. Use cy.then() instead of cy.should(), or move any commands outside the callback function.
        cy.wait("@newUser").then(({request, response}) => {
            cy.log("Request:" + JSON.stringify(request));
            cy.log("Response:" + JSON.stringify(response));

            expect(response.statusCode).to.eq(200);
            expect(request.body.user.username).to.eq(userNmae);
            expect(request.body.user.email).to.eq(email);
        })
    });

    it('Test valid login', () => {
        cy.visit("http://localhost:4200/")
        cy.get(".nav").contains("Sign in").click();
        cy.get("[placeholder='Email']").type(email);
        cy.get("[placeholder='Password']").type(password);
        cy.get("button").contains("Sign in").click();
    });

    it('Mock Popular Tags /tags API response', () => {
        //https://api.realworld.io/api/tags
        cy.intercept("GET", "**/tags", {fixture: 'popularTags.json'});

        cy.visit("http://localhost:4200/")

        cy.get(".tag-list").should("contain", "JavaScript").and("contain", "Selenium");

    });

    it("Mock Global feed data", () => {
        //https://api.realworld.io/api/articles?limit=10&offset=0
        cy.intercept("GET", "**/articles*", {fixture: 'globalFeedResponse.json'}).as("Globalfeed");

        cy.visit("http://localhost:4200/")

        cy.wait("@Globalfeed");

    })
    
});