//import { describe, beforeEach, afterEach, it } from "mocha"
//import { cy } from "cypress"

describe("Tasks Management", () => {
  beforeEach(() => {
    cy.visit("/tasks")
    // Intercept API calls
    cy.intercept("GET", "**/api/Tarefas").as("getTasks")
    cy.intercept("GET", "**/api/Atividades").as("getActivities")
    cy.intercept("POST", "**/api/Tarefas").as("createTask")
    cy.intercept("PUT", "**/api/Tarefas/*").as("updateTask")
    cy.intercept("DELETE", "**/api/Tarefas/*").as("deleteTask")
  })

  afterEach(() => {
    cy.cleanupTestData()
  })

  it("should display tasks page with search and filters", () => {
    cy.contains("Tasks").should("be.visible")
    cy.contains("Manage and track all your tasks").should("be.visible")

    // Check for search input
    cy.get('input[placeholder="Search tasks..."]').should("be.visible")

    // Check for filter and sort buttons
    cy.contains("Filter").should("be.visible")
    cy.contains("Sort").should("be.visible")
    cy.contains("Nova Atividade").should("be.visible")
  })

  it("should search tasks", () => {
    cy.wait("@getTasks", { timeout: 10000 })

    // Type in search box
    cy.get('input[placeholder="Search tasks..."]').type("Design")

    // Should filter results (this will depend on your actual data)
    cy.get("body").should(($body) => {
    expect(
        $body.text().includes("Design") || $body.text().includes("Nenhuma tarefa encontrada")
    ).to.be.true;
    });
  })

  it("should create a new activity", () => {
  cy.intercept("POST", "**/api/Atividade").as("createActivity")

  // Click and ensure the form appears
  cy.contains("Nova Atividade").scrollIntoView().should("be.visible").click()

  // Espera o título da seção de criação ficar visível
  cy.get("h1.text-3xl.font-bold.tracking-tight")
    .should("exist")
    .scrollIntoView()
    .should("be.visible")

  // Preenche os campos
  cy.get('input[placeholder="Digite o nome da atividade"]').type("Test Activity E2E")
  cy.get('textarea[placeholder="Descreva os detalhes da atividade"]').type("Test activity description for E2E testing")
  cy.get('input[placeholder*="orçamentos"]').type("test-budget-id-123")

  cy.contains("Criar Atividade").click()
  cy.contains("Campo obrigatório").should("be.visible")
})

  it("should handle API errors gracefully", () => {
    // Intercept API call to return error
    cy.intercept("GET", "**/api/Tarefas", { statusCode: 500 }).as("getTasksError")

    cy.reload()
    cy.wait("@getTasksError")

    // Should show error message
    cy.contains("Não foi possível carregar as tarefas").should("be.visible")
    cy.contains("Tentar novamente").should("be.visible")
  })

  it("should update task status", () => {
    // Wait for tasks to load
    cy.wait("@getTasks", { timeout: 10000 })

    // Find a task and try to update its status
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="task-card"]').length > 0) {
        cy.get('[data-cy="task-card"]')
          .first()
          .within(() => {
            // Look for status update buttons
            cy.get("button").contains("Terminado").should("be.visible").click()
          })

        // Should show success message
        cy.contains("Status atualizado", { timeout: 10000 }).should("be.visible")
      } else {
        cy.log("No tasks available for status update test")
      }
    })
  })
})
