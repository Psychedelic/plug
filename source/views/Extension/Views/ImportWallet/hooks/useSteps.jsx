import React, { useState, useEffect } from "react";
import { HANDLER_TYPES, sendMessage } from "@background/Keyring";
import { toast } from "react-toastify";
import { LinkButton } from "@components";
import { useTranslation } from "react-i18next";
import { useRouter } from "@components/Router";
import BackIcon from "@assets/icons/back.svg";
import Step1 from "../Steps/Step1";
import Step2 from "../Steps/Step2";

const useSteps = () => {
  const [step, setStep] = useState(0);
  const { navigator } = useRouter();
  const { t } = useTranslation();

  const [userPemFile, setUserPemFile] = useState(null);
  const [validateLoading, setValidateLoading] = useState(false);
  const [importDisabled, setImportDisabled] = useState(true);

  const handleChangeStep = (index) => setStep(index);
  const handleClose = () => navigator.navigate("home");

  const leftButton = (onClick) => (
    <LinkButton
      value={t("common.back")}
      onClick={onClick}
      startIcon={BackIcon}
    />
  );
  const rightButton = (
    <LinkButton value={t("common.close")} onClick={handleClose} />
  );

  useEffect(() => {
    if (userPemFile === null) {
      setImportDisabled(true);
      return;
    }

    setValidateLoading(true);
    let fileReader = new FileReader();
    try {
      fileReader.readAsText(userPemFile);
    } catch (e) {
      toast(t("importPem.fileNotSupported"), { type: "error" });
      setUserPemFile(null);

      return;
    }
    fileReader.onloadend = async () => {
      const content = fileReader.result;

      sendMessage(
        {
          type: HANDLER_TYPES.VALIDATE_PEM,
          params: { pem: content },
        },
        (response) => {
          const { isValid, errorType } = response;
          if (!isValid) {
            toast(t(`importPem.${errorType}`), { type: "error" });
            setUserPemFile(null);
          }
          setValidateLoading(false);
          setImportDisabled(!isValid);
        }
      );
    };
  }, [userPemFile]);

  const steps = [
    {
      component: (
        <Step1
          handleChangeStep={handleChangeStep}
          setUserPemFile={setUserPemFile}
          validateLoading={validateLoading}
          importDisabled={importDisabled}
          userPemFile={userPemFile}
        />
      ),
      left: leftButton(() => handleClose()),
      right: rightButton,
      center: `${t("importPem.importPEMfile")}`,
    },
    {
      component: <Step2 handleClose={handleClose} userPemFile={userPemFile} />,
      right: rightButton,
      center: `${t("importPem.walletDetails")}`,
    },
  ];

  return steps[step];
};

export default useSteps;
