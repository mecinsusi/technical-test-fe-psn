"use client";

import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Column } from "primereact/column";
import { FilterMatchMode, FilterService } from "primereact/api";
import { Comment, useComments } from "@/hooks/comments";
import { useEffect, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";

//Filter service from primereact
FilterService.register("custom_activity", (value, filters) => {
  const [from, to] = filters ?? [null, null];
  if (from === null && to === null) return true;
  if (from !== null && to === null) return from <= value;
  if (from === null && to !== null) return value <= to;
  return from <= value && value <= to;
});

export function TableComponent() {
  let emptyComment: Comment = {
    id: 0,
    postId: 0,
    name: "",
    email: "",
    body: "",
  };
  const { comments, deleteComment, addComment } = useComments();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [commentDialog, setCommentDialog] = useState<boolean>(false);
  const [comment, setComment] = useState<Comment>(emptyComment);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);

  //Filter for search box
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    body: { value: null, matchMode: FilterMatchMode.IN },
  });

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="right">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
            className="p-2"
          />
        </IconField>
      </div>
    );
  };

  const header = renderHeader();

  //Open pop-up new comment
  const openNewComment = () => {
    setComment(emptyComment);
    setSubmitted(false);
    setCommentDialog(true);
  };

  //Hide pop-up new comment
  const hideDialog = () => {
    setSubmitted(false);
    setCommentDialog(false);
  };

  //Cek panjang data comment setiap perubahan tambah atau hapus
  useEffect(() => {
    console.log(`Comments length`, comments.length);
  }, [comments]);

  const productDialogFooter = (
    <div>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button
        label="Save"
        icon="pi pi-check"
        onClick={() => {
          if (isEmailInvalid === false) {
            addComment(comment);
            setSubmitted(true);
            setCommentDialog(false);
          }
        }}
      />
    </div>
  );

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    const val = (e.target && e.target.value) || "";
    let _comment = { ...comment };

    // @ts-ignore
    _comment[name] = val;

    setComment(_comment);
  };

  useEffect(() => {
    if (comment.email !== "") {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      console.log(`Comment ${comment.email}`);
      setIsEmailInvalid(!regex.test(comment.email));
    } else {
      setIsEmailInvalid(false);
    }
  }, [comment]);

  useEffect(() => {
    console.log(`EMAIL ${isEmailInvalid} ${comment.email}`);
  }, [isEmailInvalid]);

  //  Handle the delete comment with a pop-up notification to ensure the delete
  const handleDelete = (id: number) => {
    confirmDialog({
      message: "Are you sure to delete this comment?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Yes",
      rejectLabel: "No",
      className: "w-[800px]",
      draggable: false,
      accept: () => deleteComment(id),
      reject: () => {},
    });
  };

  const createCommentButton = (
    <div>
      <Button
        label="Create Comment"
        icon="pi pi-plus"
        severity="success"
        onClick={openNewComment}
        className="w-fit"
      />
    </div>
  );

  return (
    <div className="card mt-16">
      <Toolbar className="mb-4" left={createCommentButton}></Toolbar>

      <DataTable
        value={comments}
        paginator
        rows={25}
        filters={filters}
        filterDisplay="row"
        showGridlines
        globalFilterFields={["name", "email", "body"]}
        header={header}
        scrollable
        scrollHeight="740px"
        emptyMessage="No comments found."
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        className="no-twp"
        sortField="name"
        sortOrder={1}
      >
        <Column
          field="name"
          header="Name"
          style={{ width: "25%" }}
          sortable
        ></Column>
        <Column
          field="email"
          header="Email"
          style={{ width: "25%" }}
          sortable
        ></Column>
        <Column
          field="body"
          header="Body"
          style={{ width: "50%" }}
          sortable
        ></Column>
        <Column
          header="Action"
          body={(rowData) => (
            <Button
              icon="pi pi-trash"
              className="p-button-danger p-button-sm"
              onClick={() => handleDelete(rowData.id)}
            />
          )}
          style={{ width: "10%" }}
        />
      </DataTable>

      <ConfirmDialog className="no-twp" />

      <Dialog
        visible={commentDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Product Details"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <div className="p-2">
          <div className="field">
            <label htmlFor="name" className="font-bold mb-1">
              Name
            </label>
            <InputText
              id="name"
              value={comment.name}
              required
              autoFocus
              onChange={(e) => onInputChange(e, "name")}
            />
          </div>
          <div className="field">
            <label htmlFor="email" className="font-bold mb-1">
              Email
            </label>
            <InputText
              id="email"
              value={comment.email}
              required
              autoFocus
              invalid={isEmailInvalid}
              onChange={(e) => onInputChange(e, "email")}
            />
            {isEmailInvalid && (
              <span className="text-red-700">Email is invalid.</span>
            )}
          </div>
          <div className="field">
            <label htmlFor="body" className="font-bold mb-1">
              Body
            </label>
            <InputText
              id="body"
              value={comment.body}
              required
              autoFocus
              onChange={(e) => onInputChange(e, "body")}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
