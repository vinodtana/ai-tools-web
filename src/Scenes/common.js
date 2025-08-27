export const gotoLoginPage = () => {
    var tableColumns1 = localStorage.getItem("tableColumns");
    localStorage.clear();
    localStorage.setItem("tableColumns", tableColumns1);
  
    window.location.href = "/login";
  };