import HomebrewFeatsManager from "@/components/Homebrew/HomebrewFeatsManager";
import HomebrewRulesManager from "@/components/Homebrew/HomebrewRulesManager";
import HomebrewSpellsManager from "@/components/Homebrew/HomebrewSpellsManager";

export default function ProfileHomebrewSection() {
    return (
        <div className="mb-6">
            <div className="mb-4">
                <h3 className="sectionTitle">Homerules</h3>
                <p className="text-sm muted">Gestiona reglas, dotes y conjuros personalizados.</p>
            </div>
            <div className="space-y-6">
                <HomebrewRulesManager />
                <HomebrewFeatsManager />
                <HomebrewSpellsManager />
            </div>
        </div>
    );
}
