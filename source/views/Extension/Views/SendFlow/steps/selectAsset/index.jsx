import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import {
  IDInput,
  FormItem,
  MultiInput,
  Container,
  Button,
  Dialog,
} from "@components";
import { useTranslation } from "react-i18next";
import { Typography } from "@material-ui/core";
import NumberFormat from "react-number-format";
import { ADDRESS_TYPES } from "@shared/constants/addresses";
import { isICNSName } from "@shared/utils/ids";
import {
  setSendTokenAmount,
  setSendTokenAddress,
  resetState,
} from "@redux/send";

import useStyles from "../../styles";
import { CyclesToAccountWarning } from "./components";
import Skeleton from "react-loading-skeleton";

const SelectAsset = ({
  resolvedAddress,
  availableAmount,
  loadingAddress,
  handleChangeStep,
  handleSwapValues,
  handleChangeAsset,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const { assets, assetsLoading } = useSelector((state) => state.wallet);
  const {
    amount: rawAmount,
    address,
    addressInfo,
    selectedAsset,
    primaryValue,
    secondaryValue,
  } = useSelector((state) => state.send);
  const amount = Number(rawAmount);
  const { principalId, accountId } = useSelector((state) => state.wallet);

  const isUserAddress =
    [principalId, accountId].includes(address) ||
    [principalId, accountId].includes(resolvedAddress);
  const conversionPrice = amount / secondaryValue.price;

  const [openAssets, setOpenAssets] = useState(false);

  const handleCloseAssets = (value) => {
    setOpenAssets(false);
    handleChangeAsset(value);
  };

  const isContinueDisabled =
    !(parseFloat(amount) > 0) ||
    !addressInfo.isValid ||
    loadingAddress ||
    address === null ||
    address === "" ||
    isUserAddress;

  const handleChangeAmount = (newAmount) => {
    dispatch(setSendTokenAmount(newAmount));
  };

  const handleChangeAddress = (newAddress) => {
    dispatch(setSendTokenAddress(newAddress));
  };

  useEffect(() => {
    dispatch(resetState());
  }, []);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormItem
            label={t("send.asset")}
            component={
              <MultiInput
                name={selectedAsset?.symbol}
                image={selectedAsset?.logo}
                onClick={() => setOpenAssets(true)}
                value={amount.toFixed(6).slice(0, -1)}
                onChange={handleChangeAmount}
                primaryValue={primaryValue}
                secondaryValue={secondaryValue}
                conversionPrice={conversionPrice}
                handleSwapValues={handleSwapValues}
                availableAmount={availableAmount.amount}
                decimalScale={5}
                buttonTestId="select-token-button"
                inputTestId="select-token-input"
                swapTestId="select-token-swap-button"
              />
            }
            subtitle={
              <div className={classes.subtitle}>
                <Typography variant="subtitle2" className={classes.pre}>
                  {assetsLoading ? (
                    <Skeleton inline height={10} width={40} />
                  ) : (
                    <NumberFormat
                      value={availableAmount.amount.toFixed(6)}
                      decimalScale={5}
                      fixedDecimalScale
                      thousandSeparator=","
                      displayType="text"
                      prefix={availableAmount.prefix}
                      suffix={availableAmount.suffix}
                      data-testid="available-amount"
                    />
                  )}
                  &nbsp;
                  {t("send.available")}
                </Typography>

                <Button
                  variant="primaryOutlined"
                  value={t("common.max")}
                  data-testid="max-button"
                  onClick={() =>
                    handleChangeAmount(
                      Number(availableAmount.amount.toFixed(6))
                    )
                  }
                />
              </div>
            }
          />
          <Dialog
            title={t("send.selectAsset")}
            items={assets}
            onClose={handleCloseAssets}
            selectedValue={selectedAsset}
            open={openAssets}
            titleTestId="select-asset"
            menuItemTestId="select-token-button"
            data-testid="select-asset-dialog"
          />
        </Grid>
        <Grid item xs={12}>
          <FormItem
            label={t("send.to")}
            component={
              <IDInput
                loading={loadingAddress}
                value={address}
                onChange={handleChangeAddress}
                isValid={addressInfo.isValid && !isUserAddress}
                data-testid="send-to-principalID-input"
              />
            }
          />
        </Grid>
        {addressInfo.type === ADDRESS_TYPES.ACCOUNT &&
          selectedAsset.id === "CYCLES" && <CyclesToAccountWarning />}
        {!!address && !addressInfo?.isValid && !loadingAddress && (
          <span className={classes.errorMessage}>
            {isICNSName(address)
              ? t("send.invalidICNS")
              : t("send.invalidAddress")}
          </span>
        )}
        {isUserAddress && (
          <span className={classes.errorMessage}>
            {t("deposit.sameAddressFromTo")}
          </span>
        )}
        <Grid item xs={12} style={{ paddingTop: "18px" }}>
          <Button
            variant="rainbow"
            value={t("common.continue")}
            fullWidth
            disabled={isContinueDisabled}
            onClick={handleChangeStep}
            loading={loadingAddress}
            buttonTestId="continue-button"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

SelectAsset.propTypes = {
  handleChangeStep: PropTypes.func.isRequired,
  handleSwapValues: PropTypes.func.isRequired,
  handleChangeAsset: PropTypes.func.isRequired,
  loadingAddress: PropTypes.bool.isRequired,
};

export default SelectAsset;
