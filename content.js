async function fetchGroupHubConfig() {
    const pathParts = location.pathname.split("/");
    let userOrOrg = "";

    if (pathParts[1] === "orgs" && pathParts[2]) {
        userOrOrg = pathParts[2];
    } else if (pathParts[1]) {
        userOrOrg = pathParts[1];
    } else {
        console.warn("Unable to determine user or org from URL.");
        return;
    }

    const configUrl = `https://raw.githubusercontent.com/${userOrOrg}/grouphub.public/main/config.json`;

    try {
        const res = await fetch(configUrl);
        if (!res.ok) throw new Error();

        const data = await res.json();

        if (!data || !data.group || !Array.isArray(data.group)) {
            console.warn(
                `Invalid format in config file at '${userOrOrg}/grouphub.public/config.json'`
            );
            return;
        }

        return data;
    } catch (err) {
        console.warn(
            `'grouphub.public/config.json' missing or unreadable for user/org "${userOrOrg}"`
        );
        return;
    }
}

window.addEventListener("load", () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);

    // Fonction d'injection dans #user-repositories-list
    async function injectBox() {
        const label = "Groups";
        const repoListUser = document.getElementById("user-repositories-list");
        const repoListOrg = document.querySelector(
            '[class^="RepositoriesPage-module__repositoriesListWrapper"]'
        );
        const target = repoListUser || repoListOrg;
        if (!target) return;

        if (document.getElementById("my-box")) return;

        const box = document.createElement("div");
        box.id = "my-box";
        box.style.cssText = `
            background-color: #161B22;
            color: #F1F6FB;
            padding: 0px;
            margin-bottom: 16px;
            margin-left: 8px;
            border-radius: 8px;
            border: 1px solid #30353C;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        `;

        const parts = location.pathname.split("/");
        let userOrOrg = "";
        if (parts[1] === "orgs" && parts[2]) userOrOrg = parts[2];
        else if (parts[1]) userOrOrg = parts[1];
        else return;

        const config = await fetchGroupHubConfig(userOrOrg);

        if (!config) {
            box.textContent = `📦 ${label} — 'github.com/${userOrOrg}/grouphub.public/config.json' missing`;
        } else {
            const header = document.createElement("div");
            header.style.cssText = `
                padding: 8px;
            `;
            header.innerHTML = `<strong style="font-size: 16px">📦 ${config.group.length} ${label}</strong>`;
            box.appendChild(header);

            for (const group of config.group) {
                const section = document.createElement('div');
                section.style.cssText = `
                    padding: 0px;
                    background-color: #0E1116;
                    margin: 0px;
                    `;

                const line = document.createElement("hr");
                line.style.cssText = `
                border: none;
                border-top: 1px solid #30353C;
                margin: 0px;
                padding: 0px;
                `;
                section.appendChild(line);

                // Collapsible header
                const groupLabel = document.createElement("div");
                groupLabel.style.cssText = `
                    font-weight: 600;
                    cursor: pointer;
                    padding: 8px;
                    display: flex;
                    align-items: center;
                `;
                groupLabel.innerHTML = `<b>[▸] ${group.name}</b>`;
                section.appendChild(groupLabel);

                // Container for repos
                const repoContainer = document.createElement("div");
                repoContainer.style.cssText = `
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    margin: 0px;

                `;
                repoContainer.style.display = "none"; // Start hidden

                // Toggle logic
                groupLabel.addEventListener("click", () => {
                    const isHidden = repoContainer.style.display === "none";
                    repoContainer.style.display = isHidden ? "flex" : "none";
                    groupLabel.innerHTML = `<b>${isHidden ? "[▾]" : "[▸]"} ${group.name}</b>`;
                });

                // Populate repos
                group.repos.sort((a, b) => a.localeCompare(b));

                for (const repoFullName of group.repos) {
                    const repoUrl = `https://github.com/${userOrOrg}/${repoFullName}`;

                    // Exemple d'utilisation
                    const repoItem = document.createElement("div");
                    repoItem.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        margin: 6px;
                        padding: 6px 6px;
                        border: 1px solid #3E444C;
                        border-radius: 6px;
                        background-color: #22282F;
                    `;

                    repoItem.innerHTML = `
                        <a href="${repoUrl}" target="_blank" style="font-weight: 500; color: #0969da; text-decoration: none;">
                            ${repoFullName}
                        </a>
                    `;
//                        <span style="display: flex; align-items: center; gap: 6px; margin-left: 8px; font-size: 12px; color: #57606a;">
//                            <span style="
//                                display: inline-block;
//                                width: 12px;
//                                height: 12px;
//                                border-radius: 50%;
//                                background-color: ${langs?.[0]?.color};
//                            "></span>
//                            ${langs?.[0]?.name || "?"}
//                        </span>
//                    `;

                    repoContainer.appendChild(repoItem);
                };

                section.appendChild(repoContainer);
                box.appendChild(section);
            };
        }

        target.insertBefore(box, target.firstChild);
    }

    // Détection des pages
    if (path.startsWith("/orgs/") && path.includes("/repositories")) {
        injectBox();
    } else if (searchParams.get("tab") === "repositories") {
        injectBox();
    }
});
