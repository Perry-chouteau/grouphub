async function fetchGroupHubConfig(userOrOrg) {
    const configUrl = `https://raw.githubusercontent.com/${userOrOrg}/grouphub.public/main/config.json`;

    try {
        const res = await fetch(configUrl);
        if (!res.ok) throw new Error();
        const data = await res.json();
        console.log(data);
        if (!data || !Array.isArray(data.group)) {
            console.warn(`Invalid format at ${configUrl}`);
            return null;
        }

        return data;
    } catch {
        console.warn(`Missing or unreadable config at ${configUrl}`);
        return null;
    }
}