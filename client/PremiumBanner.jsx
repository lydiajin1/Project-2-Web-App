const React = require('react');

// Component for displaying premium status and upgrade option
const PremiumBanner = ({ recipeCount, isPremium, onUpgrade }) => {
    const handleUpgrade = async () => {
        const response = await fetch('/upgradePremium', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        if (result.message) {
            alert('Upgraded to premium! You now have unlimited recipes, edit access, and search options!');
            onUpgrade();
        }
    };

    if (isPremium) {
        return (
            <div className="premiumBanner premiumBannerSuccess notification">
                <p className="recipeCount has-text-weight-bold">Premium Account - Unlimited Recipes + Edit Access + Search Bar!</p>
            </div>
        );
    }

    return (
        <div className="premiumBanner premiumBannerFree notification">
            <div>
                <p className="recipeCount has-text-weight-bold">Recipes: {recipeCount} / 5 (Free Plan)</p>
                <p className="premiumPerks">Unlock unlimited recipes, edit access, and search features!</p>
            </div>
            <button className="upgradeButton button is-primary" onClick={handleUpgrade}>
                Upgrade to Premium
            </button>
        </div>
    );
};

module.exports = PremiumBanner;
