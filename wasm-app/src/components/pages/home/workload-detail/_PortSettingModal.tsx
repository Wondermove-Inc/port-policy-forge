import { Box, FormControlLabel, RadioGroup, TextField } from "@mui/material";
import {
  Button,
  Modal,
  ModalFooter,
  ModalHeader,
  Radio,
  Select,
  Textarea,
  Toggle,
  Typography,
} from "@skuber/components";
import { useFieldArray, Controller, useForm } from "react-hook-form";

import { DescriptionWithDetails } from "@/components/atoms/DescriptionWithDetails";
import { AddIcon } from "@/components/icons/AddIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { PortAccessSettingForm } from "@/models";

interface PortSettingModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

export const PortSettingModal = ({
  isOpen,
  handleClose,
}: PortSettingModalProps) => {
  const form = useForm<PortAccessSettingForm>({
    defaultValues: {
      sources: [
        {
          source: "",
          type: "",
          comment: "",
        },
      ],
      allowFullAccess: false,
      access: null,
      port: null,
    },
  });

  const { control, watch } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sources",
  });

  const handleAddSource = () => append({ source: "", type: "", comment: "" });

  const allowFullAccess = watch("allowFullAccess");

  return (
    <Modal width={646} open={isOpen} onClose={handleClose}>
      <ModalHeader title="Port Access settings" onClose={handleClose} />
      <Box sx={{ p: "16px 20px 0 20px" }}>
        <DescriptionWithDetails
          description="Please enter the port to open. You can enter it in one of the following three formats."
          details={[
            "Single port: 30080",
            "Multiple ports: enter separated by commas (e.g. 30080,30081,30082)",
            "Port range: enter the range with a hyphen (e.g. 30080-30090)",
          ]}
        />
        <TextField
          id="port"
          sx={{
            width: "100% !important",
            ".MuiFormLabel-root": {
              bgcolor: "unset",
            },
          }}
          placeholder="Port number"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
          maxHeight: "450px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: "20px",
            pb: 0,
          }}
        >
          <Typography variant="body1">Allow all access</Typography>
          <Controller
            name="allowFullAccess"
            control={control}
            render={({ field }) => <Toggle {...field} checked={field.value} />}
          />
        </Box>
        {!allowFullAccess && (
          <>
            <Box sx={{ px: "31px" }}>
              <Controller
                name="access"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    sx={{ display: "flex", alignItems: "center", gap: 3 }}
                    row
                    {...field}
                  >
                    <FormControlLabel
                      sx={{ display: "flex", gap: 1 }}
                      value="some"
                      control={<Radio />}
                      label="Open only some ports"
                    />
                    <FormControlLabel
                      sx={{ display: "flex", gap: 1 }}
                      value="excluding"
                      control={<Radio />}
                      label="Open excluding some ports"
                    />
                  </RadioGroup>
                )}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    px: "20px",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <TextField
                        id="source"
                        label="Source"
                        sx={{
                          flex: 1,
                          ".MuiFormLabel-root": {
                            bgcolor: "unset",
                          },
                        }}
                      />
                      <Select
                        sx={{ flex: 1 }}
                        options={[{ label: "TCP", value: "tcp" }]}
                      />
                    </Box>
                    <Textarea
                      sx={{
                        ".MuiFormLabel-root": {
                          bgcolor: "unset",
                        },
                      }}
                      label="Comment"
                    />
                  </Box>
                  {index !== 0 && (
                    <DeleteIcon
                      size={20}
                      sx={{ cursor: "pointer" }}
                      onClick={() => remove(index)}
                    />
                  )}
                </Box>
              ))}
              <Button
                variant="text"
                size="extraSmall"
                sx={{
                  width: 94,
                  height: 24,
                  color: "text.primary",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  ml: 2,
                  mb: 2,
                }}
                onClick={handleAddSource}
              >
                <AddIcon size={16} color="white" />
                <Typography variant="labelBold">Add Source</Typography>
              </Button>
            </Box>
          </>
        )}
      </Box>
      <ModalFooter
        cancelButtonTitle="Cancel"
        confirmButtonTitle="Apply"
        onClickCancelButton={handleClose}
        onClickConfirmButton={() => {}}
      />
    </Modal>
  );
};
