import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { State, transactionCreators } from "../redux";
import { CategoryOptions, TypeOptions } from "../utils/Constant";
import Dialog from "../components/Dialog";
import { useNavigate } from "react-router-dom";
import * as PATH from "../config/Path";

type TransactionErrorsFormType = {
  category: string;
  type: string;
  detail: string;
  amount: string;
};

function AddTransaction() {
  const token = localStorage.getItem("token");

  const dispatch = useDispatch();
  const { addTransaction } = bindActionCreators(transactionCreators, dispatch);

  const { addTransactionResult } = useSelector(
    (state: State) => state.transaction
  );

  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: "Select category",
    type: "Select type",
    detail: "",
    amount: 0,
  });

  const [formErrors, setFormErrors] = useState<TransactionErrorsFormType>({
    category: "",
    type: "",
    detail: "",
    amount: "",
  });
  const [isFormValid, setIsFormValid] = useState(true);
  const [openUserInputDialog, setOpenUserInputDialog] = useState(false);
  const [transactionSubmit, setTransactionSubmit] = useState(false);

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isFormTransactionValid()) {
      try {
        if (token) {
          addTransaction(form, token);
          setTransactionSubmit(true);
        }
      } catch (error) {
        console.log("Something went wrong");
      }
    } else {
      setOpenUserInputDialog(!openUserInputDialog);
    }
  };

  const isFormTransactionValid = () => {
    const newErrors: TransactionErrorsFormType =
      {} as TransactionErrorsFormType;
    if (form.type === "Select type") {
      newErrors.type = "Type is required";
    }
    if (form.category === "Select category") {
      newErrors.category = "Category is required";
    }

    if (form.detail === "") {
      newErrors.detail = "Detail is required";
    }

    if (form.amount === 0) {
      newErrors.amount = "Amount is required";
    }

    setFormErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (addTransactionResult && transactionSubmit) {
      navigate(PATH.TRANSACTIONS);
    }
  }, [JSON.stringify(addTransactionResult)]);

  return (
    <>
      <div className="page_title">Add Transaction</div>
      <div className="container add-transaction__form">
        <Dropdown
          options={TypeOptions}
          name="type"
          value={form.type}
          onChange={handleChange}
        />

        <Dropdown
          options={CategoryOptions}
          name="category"
          value={form.category}
          onChange={handleChange}
        />

        <Input
          type="text"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />

        <Input
          type="text"
          name="detail"
          placeholder="Detail"
          value={form.detail}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />

        <Button
          title="Add Transaction"
          className="primary-button"
          onClick={(e) => handleSubmit(e)}
        />
      </div>

      {!isFormValid && openUserInputDialog && (
        <Dialog
          title="Incomplete Request"
          handleCloseDialog={() => setOpenUserInputDialog(!openUserInputDialog)}
        >
          <div className="dialog__content">
            <p>
              Oops! We couldn’t submit your transaction because some required
              fields are missing:
            </p>
            <ul>
              {Object.entries(formErrors).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
            <p>
              Make sure all required fields are completed before submitting.
            </p>
          </div>
          <div className="dialog__actions">
            <button
              className="primary-button"
              onClick={() => setOpenUserInputDialog(!openUserInputDialog)}
            >
              OK
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}

export default AddTransaction;
