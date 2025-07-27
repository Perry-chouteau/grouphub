// ui/box.js

function buildGroupBox(config, userOrOrg) {
    const label = "Groups";

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

    if (!config) {
        box.textContent = `📦 ${label} — 'github.com/${userOrOrg}/grouphub.public/config.json' missing`;
        return box;
    }

    const header = document.createElement("div");
    header.style.padding = "8px";
    header.innerHTML = `<strong style="font-size: 16px">📦 ${config.group.length} ${label}</strong>`;
    box.appendChild(header);

    for (const group of config.group) {
        const section = document.createElement("div");
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

        const repoContainer = document.createElement("div");
        repoContainer.style.cssText = `
            display: none;
            flex-wrap: wrap;
            gap: 6px;
            margin: 0px;
        `;

        groupLabel.addEventListener("click", () => {
            const isHidden = repoContainer.style.display === "none";
            repoContainer.style.display = isHidden ? "flex" : "none";
            groupLabel.innerHTML = `<b>${isHidden ? "[▾]" : "[▸]"} ${group.name}</b>`;
        });

        group.repos.sort().forEach(repoName => {
            const repoItem = document.createElement("div");
            repoItem.style.cssText = `
                display: flex;
                align-items: center;
                gap: 6px;
                margin: 6px;
                padding: 6px;
                border: 1px solid #3E444C;
                border-radius: 6px;
                background-color: #22282F;
            `;

            repoItem.innerHTML = `
                <a href="https://github.com/${userOrOrg}/${repoName}" target="_blank"
                   style="font-weight: 500; color: #0969da; text-decoration: none;">
                    ${repoName}
                </a>
            `;

            repoContainer.appendChild(repoItem);
        });

        section.appendChild(repoContainer);
        box.appendChild(section);
    }

    return box;
}