import { Button, TextField, Typography } from "@mui/material";
import { Committee_Members } from "../data/slsq-members";
import { ChangeEvent, useState } from "react";

interface member {
  post: string;
  name: string;
}

const defaultMemberForm = {
  post: "",
  name: "",
};
const Members = () => {
  const [members, setMembers] = useState<member[]>(Committee_Members);

  const [memberForm, setMemberForm] = useState<member>(defaultMemberForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMemberForm({ ...memberForm, [name]: value });
    console.log(memberForm.post);
    console.log(memberForm.name);

    // const newErrors = validateForm(signInForm);
    // setErrors(newErrors);
  };

  const handleCancel = () => {
    defaultMemberForm.post = "";
    defaultMemberForm.name = "";
  };

  const handleEdit = (rowData: member) => {
    console.log("Row Data : ", rowData);
    // const { name, value } = event.target;
    defaultMemberForm.post = rowData.post;
    defaultMemberForm.name = rowData.name;
    setMemberForm({ ...memberForm, name: rowData.name, post: rowData.post });
    console.log("Row Data : ", memberForm);
    // defaultMemberForm.post = rowData?.post;
    // defaultMemberForm.name = rowData?.name;
    // defaultMemberForm.post = "President";
    // defaultMemberForm.name = "Thusith Kathaluwage";
    // console.log("Row Data : ", defaultMemberForm);
    // updateMemberName(defaultMemberForm);
    // Sandhya Abeysekera
    // setmembers = ;
    //  const entry = ele!.parentElement?.parentElement;
    //  console.log(entry);
  };

  const handleSubmit = (editedMember: member) => {
    updateMemberName(editedMember);
  };

  const updateMemberName = (editedMember: member) => {
    setMembers((prevMembers) => {
      return prevMembers?.map((member) => {
        return member?.post === editedMember?.post
          ? { ...member, name: editedMember.name }
          : member;
      });
    });
  };

  const addPost = (newMember: member) => {
    setMembers((prevMembers) => {
      return prevMembers.map((member) => {
        return member?.post !== newMember?.post
          ? { ...newMember, prevMembers }
          : member;
      });
    });
  };

  return (
    <div
      className="w-[50%] md:w1-[30%] my-5 mx-auto
                m-auto rounded-[1em] border-1 border-[#000]
                shadow-[0px_10px_20px_0px_rgba(000,_10,_10,_0.15)] text-black"
    >
      <div className="my-3 text-center font-bold">SLSQ Members Add/Update</div>
      <div className="w-[100%] m-auto py-5">
        <table className="w-[90%] m-auto border1-2 border1-[#fff] rounded-[.2em] p1-5">
          <thead>
            <tr className="bg-[#800020] text-white rounded-[.2em]">
              <td className="w-[30%]">Post</td>
              <td className="w-[60%]">Name</td>
              <td className="w-[10%]">Action</td>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => {
              return (
                <tr className="border-2 border-[#fff]" key={index}>
                  <td>{member.post}</td>
                  <td>{member.name}</td>
                  <td>
                    <button onClick={() => handleEdit(member)}>Edit</button>
                    {/* <Typography
                      color="gray"
                      className="text-center font-normal py-1"
                    >
                      <Button
                        variant="contained"
                        style={{
                          width: "30%",
                          margin: "0px",
                          backgroundColor: "#800020",
                          color: "#fff",
                        }}
                        onClick={() => handleEdit({ member })}
                      >
                        Edit
                      </Button>
                    </Typography> */}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot></tfoot>
        </table>
      </div>
      <div className="flex w-[100%] m-auto">
        <div className="flex flex-col w-[50%] m-auto">
          <Typography
            style={{ marginTop: "30px" }}
            variant="h6"
            className="flex flex-col"
          >
            Post
          </Typography>
          <TextField
            error
            name="post"
            label="Post"
            margin="normal"
            size="small"
            disabled
            // className="text-[#000]"
            //    defaultValue={email}
            //   onChange={}
            //   helperText="Incorrect entry."
          />
          <Typography
            style={{ marginTop: "30px" }}
            variant="h6"
            className="flex flex-col"
          >
            Member name
          </Typography>
          <TextField
            error
            name="name"
            label="Name"
            margin="normal"
            size="small"
            // className="text-[#000]"
            //    defaultValue={email}
            onChange={handleChange}
            //   helperText="Incorrect entry."
          />
          <div className="flex m-auto">
            <Typography color="gray" className="text-center font-normal py-1">
              <Button
                variant="contained"
                style={{
                  width: "30%",
                  margin: "0px",
                  backgroundColor: "#800020",
                  color: "#fff",
                }}
                onClick={() => handleSubmit(memberForm)}
              >
                Save
              </Button>
            </Typography>
            <Typography color="gray" className="text-center font-normal py-1">
              <Button
                variant="contained"
                style={{
                  width: "30%",
                  margin: "0px",
                  backgroundColor: "#800020",
                  color: "#fff",
                }}
                onClick={() => handleCancel()}
              >
                Cancel
              </Button>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
