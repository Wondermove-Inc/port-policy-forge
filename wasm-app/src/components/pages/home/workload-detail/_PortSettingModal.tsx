import { Box, FormControlLabel, List, ListItem, RadioGroup, TextField } from "@mui/material";
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
import { defaultTheme } from "@skuber/theme";
import { useFieldArray, UseFormReturn, Controller } from "react-hook-form";

import { AddIcon } from "@/components/icons/AddIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { PortAccessSettingForm } from "@/models";

interface PortSettingModalProps {
  isOpen: boolean;
  handleClose: () => void;
  form: UseFormReturn<PortAccessSettingForm>;
}

export const PortSettingModal = ({ isOpen, handleClose, form }: PortSettingModalProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sources",
  });

  const handleAddSource = () => append({ source: "", type: "", comment: "" });

  const allowFullAccess = form.watch("allowFullAccess");

  return (
    <Modal width={646} open={isOpen} onClose={handleClose}>
      <ModalHeader title="Port Access settings" onClose={handleClose} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", maxHeight: "450px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderBottom: 1,
            borderColor: "border.default",
          }}
        >
          <Typography variant="body1">Allow full access</Typography>
          <Controller
            name="allowFullAccess"
            control={form.control}
            render={({ field }) => <Toggle {...field} checked={field.value} />}
          />
        </Box>
        <Box sx={{ px: "20px" }}>
          <Typography>Opening the port will result in the following changes</Typography>
          <List
            sx={{
              pl: 3,
              pt: 1,
              listStyleType: "disc",
              ...defaultTheme.typography.body2,
            }}
          >
            <ListItem sx={{ display: "list-item", p: 0 }}>
              The closed port becomes externally accessible again.
            </ListItem>
            <ListItem sx={{ display: "list-item", p: 0 }}>Service traffic through that port is allowed.</ListItem>
          </List>
        </Box>
        {!allowFullAccess && (
          <>
            <Box sx={{ px: "30px" }}>
              <Controller
                name="access"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup sx={{ display: "flex", alignItems: "center", gap: 3 }} row {...field}>
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
                <Box key={field.id} sx={{ display: "flex", gap: 2, px: "20px", alignItems: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      flex: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                      <Select sx={{ flex: 1 }} options={[{ label: "TCP", value: "tcp" }]} />
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
                  {index !== 0 && <DeleteIcon size={20} sx={{ cursor: "pointer" }} onClick={() => remove(index)} />}
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
