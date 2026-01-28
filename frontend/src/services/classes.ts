import api from "./api";

export const getClasses = () => api.get("/school-classes");
