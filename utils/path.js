// utils/path.js

function getUserOrOrgFromPath() {
    const parts = location.pathname.split("/");
    if (parts[1] === "orgs" && parts[2]) return parts[2];
    if (parts[1]) return parts[1];
    return null;
}