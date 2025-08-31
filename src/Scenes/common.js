import mixpanel from "mixpanel-browser";
mixpanel.init("b626d469bfe9b25d908b34cb136d7feb");

export const gotoLoginPage = () => {
    var tableColumns1 = localStorage.getItem("tableColumns");
    localStorage.clear();
    localStorage.setItem("tableColumns", tableColumns1);
  
    window.location.href = "/login";
  };

export const triggerMixpanelEvent = (eventName, jsonData = {}) => {
    console.log("Mixpanel,eventName ", eventName, jsonData);


    const finalJson = { ...jsonData };
    console.log("Mixpanel,finalJson ", eventName, finalJson);
    mixpanel.track(eventName, finalJson);
  };
