interface StyleDictionary {
    [key: string]: string;
}

// Słownik dostępnych stylów
const styles: StyleDictionary = {
    style1: "style/style1.css",
    style2: "style/style2.css",
    style3: "style/style3.css"
};

// Funkcja do zmiany stylu
function changeStyle(styleName: string): void {
    const themeLink = document.getElementById("theme-style") as HTMLLinkElement;
    if (themeLink && styles[styleName]) {
        themeLink.href = styles[styleName];
    } else {
        console.error(`Styl ${styleName} nie istnieje.`);
    }
}

// Funkcja do dynamicznego generowania linków
function generateLinks(): void {
    const container = document.getElementById("style-links");
    if (container) {
        container.innerHTML = ""; // Wyczyść poprzednie przyciski
        for (const styleName in styles) {
            const button = document.createElement("button");
            button.textContent = `Zmień na ${styleName}`;
            button.className = "button";
            button.onclick = () => changeStyle(styleName);
            container.appendChild(button);
        }
    } else {
        console.error("Nie znaleziono elementu z id 'style-links'");
    }
}

// Wygenerowanie linków po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
    generateLinks();
});

export { changeStyle, generateLinks };
