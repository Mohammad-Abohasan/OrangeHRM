export default class VacanciesPage {
    elements = {
        pages: () => cy.get(".oxd-topbar-body-nav-tab"),
      };
    
      openCandidatesPage() {
        this.elements.pages().contains("Vacancies").click();
      }
}