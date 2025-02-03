

export const initialState = {
    fetchMaterials: [],
    filterID: "",
    filterName: "",
    filterCategory: "",
    sortDate: "down",
  };
  
export function displayReducer(state, action) {
    switch (action.type) {
      case "FETCH_SUCCESS": {
        const { materials } = action.payload;
        return {
          ...state,
          fetchMaterials: materials,
        };
      }
      case "SET_FILTER_ID": {
        console.log("ID filter")
        return {
          ...state,
          filterID: action.payload,
        };
      }
      case "SET_FILTER_NAME": {
        console.log("name filet")
        return {
          ...state,
          filterName: action.payload,
        };
      }
      case "SET_FILTER_CATEGORY": {
        return {
          ...state,
          filterCategory: action.payload,
        };
      }
      case "SET_SORT_DATE": {
        console.log("date")
        return {
          ...state,
          sortDate: state.sortDate === "up" ? "down" : "up",
        };
      }
      default:
        return state;
    }
  }


