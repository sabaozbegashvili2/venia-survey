const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
        /**
         * We need to activate esModules and cssModules to allow build pack to load our extension.
         * {@link https://magento.github.io/pwa-studio/pwa-buildpack/reference/configure-webpack/#special-flags}.
         */
        flags[targets.name] = { esModules: true, cssModules: true };
    });

    const targetables = Targetables.using(targets);

    const CheckoutPage = targetables.reactComponent(
        '@magento/venia-ui/lib/components/CheckoutPage/checkoutPage.js'
    );

    CheckoutPage.addImport(
        'import QuestionnairePopup from "@sabavend/questionnaire/src/components/QuestionnairePopup";'
    );

    CheckoutPage.insertAfterSource(
        '</StoreTitle>',
        `<QuestionnairePopup cartItems={cartItems} />`
    );
};
