sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.jec.silo.controller.View1", {
            onInit: function () {
                let oSiloModel = new sap.ui.model.json.JSONModel();
                oSiloModel.setData({
                    silos: [
                        { material: "material-1", height: 0, targetHeight: 50, materialName: "Material 1" },
                        { material: "material-2", height: 0, targetHeight: 100,materialName: "Material 2" }
                    ]
                })
                this.getView().setModel(oSiloModel, "siloModel");
            },
            formatHeight: function (height) {
                return `${height}%`
            },
            onAfterRendering: function () {
                const SilosHBox = this.byId('idSilosHBox');
                const oSiloModel = this.getView().getModel("siloModel");
                const Silos = oSiloModel.getProperty('/silos');
                if (SilosHBox.getItems().length)
                    Silos.forEach((oSilo, index) => {
                        SilosHBox.getItems()[index].addStyleClass(oSilo.material);
                    });

                setTimeout(() => {
                    Silos.forEach((oSilo, index) => {
                        // oSilo.height = oSilo.targetHeight;
                        oSiloModel.setProperty(`/silos/${index}/height`, oSilo.targetHeight);
                    })
                    // oSiloModel.refresh(); 
                }, 100);
                
            }
        });
    });
