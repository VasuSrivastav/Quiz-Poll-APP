import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      role: "",
      name: "",
      setUser: (role, name) => set({ role: role, name: name }),
      setlocal: (role, name) => {
        // for persisting the data in local storage for page reload
        // localStorage.setItem("quizStore", JSON.stringify({ role, name }));
        // set({ role: role, name: name });
        try {
          localStorage.setItem("quizStore", JSON.stringify({ role, name }));
        //   set({ role: role, name: name }); 
        }
        catch (err) {
          console.log("not able to set in local storage",err);
        }
      },
      
      getLocal: () => {
        try {
          if (localStorage.getItem("quizStore")) {
            const data = JSON.parse(localStorage.getItem("quizStore"));
            set({ role: data.role, name: data.name });
            // return data; // for checking in the console
          }
          else {
            // set({ role: "", name: "" }); // as someone loagout i cleared the local storage so auth work and move to home page
            return undefined;
          }
        } catch (err) {
          console.log("local storage not acssesed ",err);
          return undefined; // or null for error handling as it is not returning anything
        }
      },
    }),
    { name: "persistedStore" }
  )
);
