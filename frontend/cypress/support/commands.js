// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************


// Custom command to login (if authentication is implemented)
Cypress.Commands.add("login", (email = "test@example.com", password = "password") => {
  cy.session([email, password], () => {
    cy.visit("/login")
    cy.get('[data-cy="email-input"]').type(email)
    cy.get('[data-cy="password-input"]').type(password)
    cy.get('[data-cy="login-button"]').click()
    cy.url().should("not.include", "/login")
  })
})

// Custom command to wait for API calls
Cypress.Commands.add("waitForApi", (alias) => {
  cy.wait(alias).then((interception) => {
    expect(interception.response.statusCode).to.be.oneOf([200, 201, 204])
  })
})

// Custom command to create a task via API
Cypress.Commands.add("createTaskViaApi", (taskData) => {
  return cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/Tarefas`,
    body: {
      nome: taskData.nome || "Test Task",
      descricaoTarefa: taskData.descricao || "Test task description",
      status: taskData.status || "Por_Comecar",
      atividadeId: taskData.atividadeId || null,
    },
    headers: {
      "Content-Type": "application/json",
    },
    failOnStatusCode: false,
  })
})

// Custom command to create an activity via API
Cypress.Commands.add("createActivityViaApi", (activityData) => {
  return cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/Atividade`,
    body: {
      nomeAtividade: activityData.nome || "Test Activity",
      descricaoAtividade: activityData.descricao || "Test activity description",
      dataInicioAtividade: activityData.dataInicio || new Date().toISOString(),
      dataFimAtividade: activityData.dataFim || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      orcamentoIds: activityData.orcamentoIds || [],
      tarefasIds: activityData.tarefasIds || [],
      entregaveisIds: activityData.entregaveisIds || [],
      perfisIds: activityData.perfisIds || [],
    },
    headers: {
      "Content-Type": "application/json",
    },
    failOnStatusCode: false,
  })
})

// Custom command to clean up test data
Cypress.Commands.add("cleanupTestData", () => {
  // Clean up tasks
  cy.request({
    method: "GET",
    url: `${Cypress.env("apiUrl")}/Tarefas`,
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200 && response.body && response.body.length > 0) {
      response.body.forEach((task) => {
        if (task.nome && task.nome.includes("Test")) {
          cy.request({
            method: "DELETE",
            url: `${Cypress.env("apiUrl")}/Tarefas/${task.id}`,
            failOnStatusCode: false,
          })
        }
      })
    }
  })

  // Clean up activities
  cy.request({
    method: "GET",
    url: `${Cypress.env("apiUrl")}/Atividades`,
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200 && response.body && response.body.length > 0) {
      response.body.forEach((activity) => {
        if (activity.nomeAtividade && activity.nomeAtividade.includes("Test")) {
          cy.request({
            method: "DELETE",
            url: `${Cypress.env("apiUrl")}/Atividade/${activity.id}`,
            failOnStatusCode: false,
          })
        }
      })
    }
  })
})

// Custom command to check toast messages
Cypress.Commands.add("checkToast", (message, type = "success") => {
  cy.get("[data-sonner-toast]", { timeout: 10000 }).should("be.visible").and("contain.text", message)
})

// Custom command to fill date picker
Cypress.Commands.add("fillDatePicker", (selector, date) => {
  cy.get(selector).click()
  cy.get('[role="dialog"]').within(() => {
    // Navigate to the correct month/year if needed
    const targetDate = new Date(date)
    cy.get(`[data-day="${targetDate.getDate()}"]`).click()
  })
})

// Add tab command for keyboard navigation
Cypress.Commands.add("tab", { prevSubject: "optional" }, (subject) => {
  const tabKey = "{tab}"
  if (subject) {
    cy.wrap(subject).type(tabKey)
  } else {
    cy.get("body").type(tabKey)
  }
  return cy.focused()
})
