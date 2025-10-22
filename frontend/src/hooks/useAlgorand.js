// src/hooks/useAlgorand.js

import { useState, useCallback } from 'react';
import algosdk from 'algosdk';

const ALGOD_TOKEN = process.env.REACT_APP_ALGOD_TOKEN || '';
const ALGOD_SERVER = process.env.REACT_APP_ALGOD_SERVER || 'http://localhost:4001';
const ALGOD_PORT = process.env.REACT_APP_ALGOD_PORT || 4001;

const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);

export default function useAlgorand() {
  const [txId, setTxId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAccountInfo = useCallback(async (address) => {
    setLoading(true);
    setError(null);
    try {
      const info = await algodClient.accountInformation(address).do();
      return info;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAssetInfo = useCallback(async (assetId) => {
    setLoading(true);
    setError(null);
    try {
      const info = await algodClient.getAssetByID(assetId).do();
      return info;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendTransaction = useCallback(async (txn) => {
    setLoading(true);
    setError(null);
    try {
      const { txId: id } = await algodClient.sendRawTransaction(txn).do();
      setTxId(id);
      return id;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const waitForConfirmation = useCallback(async (txnId, maxRounds = 1000) => {
    setLoading(true);
    setError(null);
    try {
      let lastStatus = await algodClient.status().do();
      let lastRound = lastStatus['last-round'];
      while (lastRound < lastStatus['last-round'] + maxRounds) {
        const pendingInfo = await algodClient
          .pendingTransactionInformation(txnId)
          .do();
        if (pendingInfo['confirmed-round'] !== null) {
          return pendingInfo;
        }
        lastStatus = await algodClient.status().do();
        lastRound = lastStatus['last-round'];
      }
      throw new Error('Transaction not confirmed');
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTransactionStatus = useCallback(async (txnId) => {
    setLoading(true);
    setError(null);
    try {
      const status = await algodClient.pendingTransactionInformation(txnId).do();
      return status;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    txId,
    loading,
    error,
    getAccountInfo,
    getAssetInfo,
    sendTransaction,
    waitForConfirmation,
    getTransactionStatus,
  };
}
