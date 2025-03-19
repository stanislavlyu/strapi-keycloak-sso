import { jsx, jsxs } from "react/jsx-runtime";
import { Page } from "@strapi/strapi/admin";
import { Routes, Route } from "react-router-dom";
import { useReducer, useEffect } from "react";
import axios from "axios";
import { Loader, Box, Typography, Alert, Table, Thead, Tr, Th, Tbody, Td, Select, Option, Flex, Button } from "@strapi/design-system";
import { F as ForwardRef$4F } from "./index-6bfxaYqL.mjs";
const initialState = {
  keycloakRoles: [],
  strapiRoles: [],
  roleMappings: {},
  loading: true,
  error: null,
  success: false
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, ...action.payload, loading: false };
    case "SET_ROLE_MAPPING":
      return {
        ...state,
        roleMappings: { ...state.roleMappings, [action.keycloakRole]: action.strapiRole }
      };
    case "SET_ERROR":
      return { ...state, error: action.error, loading: false };
    case "SET_SUCCESS":
      return { ...state, success: true };
    case "RESET_SUCCESS":
      return { ...state, success: false };
    default:
      return state;
  }
};
const HomePage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    async function fetchRoles() {
      try {
        const [rolesResponse, mappingsResponse] = await Promise.all([
          axios.get("/strapi-keycloak-passport/keycloak-roles"),
          axios.get("/strapi-keycloak-passport/get-keycloak-role-mappings")
        ]);
        dispatch({
          type: "SET_DATA",
          payload: {
            keycloakRoles: rolesResponse.data.keycloakRoles,
            strapiRoles: rolesResponse.data.strapiRoles,
            roleMappings: mappingsResponse.data
          }
        });
      } catch (err) {
        dispatch({ type: "SET_ERROR", error: "Failed to fetch roles. Please check Keycloak settings." });
      }
    }
    fetchRoles();
  }, []);
  const handleRoleMappingChange = (keycloakRole, strapiRole) => {
    dispatch({ type: "SET_ROLE_MAPPING", keycloakRole, strapiRole });
  };
  const saveMappings = async () => {
    try {
      await axios.post("/strapi-keycloak-passport/save-keycloak-role-mappings", { mappings: state.roleMappings });
      dispatch({ type: "SET_SUCCESS" });
      setTimeout(() => dispatch({ type: "RESET_SUCCESS" }), 3e3);
    } catch (error) {
      dispatch({ type: "SET_ERROR", error: "Failed to save mappings. Try again." });
    }
  };
  if (state.loading) return /* @__PURE__ */ jsx(Loader, { children: "Loading roles..." });
  return /* @__PURE__ */ jsxs(Box, { padding: 8, background: "transparent", shadow: "filterShadow", borderRadius: "4px", children: [
    /* @__PURE__ */ jsx(Typography, { variant: "alpha", as: "h1", children: "Passport Role Mapping" }),
    /* @__PURE__ */ jsx(Box, { paddingTop: 4, paddingBottom: 4, children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral600", variant: "epsilon", children: "Map Keycloak roles to Strapi admin roles." }) }),
    state.error && /* @__PURE__ */ jsx(Box, { paddingBottom: 4, children: /* @__PURE__ */ jsx(Alert, { title: "Error", variant: "danger", startIcon: /* @__PURE__ */ jsx(ForwardRef$4F, {}), children: state.error }) }),
    state.success && /* @__PURE__ */ jsx(Box, { paddingBottom: 4, children: /* @__PURE__ */ jsx(Alert, { title: "Success", variant: "success", startIcon: /* @__PURE__ */ jsx(ForwardRef$4F, {}), children: "Role mappings saved successfully!" }) }),
    /* @__PURE__ */ jsxs(Box, { background: "neutral0", children: [
      /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(Thead, { children: /* @__PURE__ */ jsxs(Tr, { children: [
          /* @__PURE__ */ jsx(Th, { children: "Keycloak Role" }),
          /* @__PURE__ */ jsx(Th, { children: "Strapi Role" })
        ] }) }),
        /* @__PURE__ */ jsx(Tbody, { children: state.keycloakRoles.map((kcRole) => /* @__PURE__ */ jsxs(Tr, { children: [
          /* @__PURE__ */ jsx(Td, { children: kcRole.name }),
          /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(
            Select,
            {
              placeholder: "Select Strapi Role",
              onChange: (roleId) => handleRoleMappingChange(kcRole.name, roleId),
              value: state.roleMappings[kcRole.name] || "",
              children: state.strapiRoles.map((strapiRole) => /* @__PURE__ */ jsx(Option, { value: strapiRole.id, children: strapiRole.name }, strapiRole.id))
            }
          ) })
        ] }, kcRole.id)) })
      ] }),
      /* @__PURE__ */ jsx(Box, { padding: 4, paddingRight: 8, children: /* @__PURE__ */ jsx(Flex, { justifyContent: "flex-end", children: /* @__PURE__ */ jsx(Button, { onClick: saveMappings, variant: "primary", children: "Save Mappings" }) }) })
    ] })
  ] });
};
const App = () => {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(HomePage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Page.Error, {}) })
  ] });
};
export {
  App
};
