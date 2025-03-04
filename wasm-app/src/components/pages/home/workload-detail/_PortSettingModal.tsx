import { Box, FormControlLabel, RadioGroup, TextField } from "@mui/material";
import {
  Button,
  Modal,
  ModalHeader,
  Radio,
  Select,
  Textarea,
  Toggle,
  Typography,
} from "@skuber/components";
import { useFieldArray, Controller, UseFormReturn } from "react-hook-form";

import { DescriptionWithDetails } from "@/components/atoms/DescriptionWithDetails";
import { ModalFooter } from "@/components/atoms/ModalFooter";
import { AddIcon } from "@/components/icons/AddIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { Port, PortAccessSettingForm } from "@/models";

interface PortSettingModalProps {
  isOpen: boolean;
  port?: Port | null;
  isInbound?: boolean;
  handleClose: () => void;
  handleSubmit: (data: PortAccessSettingForm) => void;
  form: UseFormReturn<PortAccessSettingForm>;
}

export const PortSettingModal = ({
  isOpen,
  port,
  isInbound,
  handleSubmit,
  handleClose,
  form,
}: PortSettingModalProps) => {
  const { control, watch } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sources",
  });

  const handleAddSource = () => append({ source: "", type: "", comment: "" });

  const allowFullAccess = watch("allowFullAccess");

  return (
    <Modal width={646} open={isOpen} onClose={handleClose}>
      <ModalHeader
        title={port ? "Access Settings " : "Open Port"}
        onClose={handleClose}
      />
      <Box
        sx={{ overflowY: "auto", maxHeight: "586px", p: "16px 20px 0 20px" }}
      >
        {!port && (
          <>
            <DescriptionWithDetails
              description="Please enter the port to open. You can enter it in one of the following three formats."
              details={[
                "Single port: 30080",
                "Multiple ports: enter separated by commas (e.g. 30080,30081,30082)",
                "Port range: enter the range with a hyphen (e.g. 30080-30090)",
              ]}
            />
            <Box sx={{ textAlign: "center" }}>
              <Controller
                name="port"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "100% !important" }}
                    placeholder="Port number"
                  />
                )}
              />
            </Box>
          </>
        )}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              pt: "20px",
              pb: 2,
            }}
          >
            <Typography variant="body1">Allow all access</Typography>
            <Controller
              name="allowFullAccess"
              control={control}
              render={({ field }) => (
                <Toggle {...field} checked={field.value} />
              )}
            />
          </Box>
          {!allowFullAccess && (
            <>
              <Box sx={{ px: "10px", pb: "16px" }}>
                <Controller
                  name="access"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      sx={{ display: "flex", alignItems: "center", gap: 3 }}
                      row
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <FormControlLabel
                        sx={{ display: "flex", gap: 1 }}
                        value="3"
                        control={<Radio />}
                        label={
                          isInbound
                            ? "Only specific sources"
                            : "Only specific destination"
                        }
                      />
                      <FormControlLabel
                        sx={{ display: "flex", gap: 1 }}
                        value="1"
                        control={<Radio />}
                        label={
                          isInbound
                            ? "Exclude specific sources"
                            : "Exclude specific destination"
                        }
                      />
                    </RadioGroup>
                  )}
                />
              </Box>
              <Box>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
                >
                  {fields.map((field, index) => (
                    <Box
                      key={field.id}
                      sx={{ display: "flex", gap: 2, alignItems: "center" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                          flex: 1,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Controller
                            name={`sources.${index}.source`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={isInbound ? "Source" : "Destination"}
                                sx={{
                                  flex: 1,
                                  ".MuiFormLabel-root": {
                                    bgcolor: "unset !important",
                                  },
                                }}
                              />
                            )}
                          />
                          <Controller
                            name={`sources.${index}.type`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                sx={{ flex: 1 }}
                                options={[{ label: "TCP", value: "tcp" }]}
                              />
                            )}
                          />
                        </Box>
                        <Controller
                          name={`sources.${index}.comment`}
                          control={control}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              sx={{
                                "&>div": {
                                  maxHeight: "80px !important",
                                  "&.MuiInputBase-multiline textarea": {
                                    minHeight: "50px !important",
                                  },
                                },
                                ".MuiFormLabel-root": {
                                  bgcolor: "unset !important",
                                },
                              }}
                              label="Comment"
                            />
                          )}
                        />
                      </Box>
                      {fields.length > 1 && (
                        <DeleteIcon
                          size={20}
                          sx={{ cursor: "pointer" }}
                          onClick={() => remove(index)}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
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
                    mt: 1,
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
      </Box>
      <ModalFooter
        cancelButtonTitle="Cancel"
        confirmButtonTitle="Apply"
        onClickCancelButton={handleClose}
        onClickConfirmButton={form.handleSubmit(handleSubmit)}
      />
    </Modal>
  );
};
