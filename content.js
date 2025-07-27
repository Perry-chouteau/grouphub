window.addEventListener("load", async () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);

    const shouldInject =
        (path.startsWith("/orgs/") && path.includes("/repositories")) ||
        searchParams.get("tab") === "repositories";

    if (!shouldInject) return;

    const target =
        document.getElementById("user-repositories-list") ||
        document.querySelector(
            '[class^="RepositoriesPage-module__repositoriesListWrapper"]'
        );
    if (!target || document.getElementById("my-box")) return;

    const userOrOrg = getUserOrOrgFromPath();
    if (!userOrOrg) return;

    const config = await fetchGroupHubConfig(userOrOrg);
    const box = buildGroupBox(config, userOrOrg);
    target.insertBefore(box, target.firstChild);
});