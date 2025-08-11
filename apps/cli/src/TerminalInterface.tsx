import React from "react";
import { Box, Text } from "ink";
import { t } from "./i18n.js";

interface TerminalInterfaceProps {
  message: string | null;
  setMessage: () => void;
  CustomInput: React.FC<{ onSubmit: () => void }>;
  repoName: string;
}

const TerminalInterface: React.FC<TerminalInterfaceProps> = ({
  message,
  setMessage,
  CustomInput,
  repoName,
}) => {
  return (
    <Box flexDirection="column" padding={1}>
      <Box justifyContent="center" marginBottom={0}>
        <Text bold>{t('commands.description')}</Text>
      </Box>
      <Box flexDirection="column">
        <Text>{t('input.placeholder')}</Text>
      </Box>
      <Box
        borderStyle="round"
        borderColor="gray"
        paddingX={2}
        paddingY={1}
        marginTop={0}
        marginBottom={0}
      >
        <CustomInput onSubmit={() => setMessage()} />
      </Box>
      {message && (
        <Box marginTop={1}>
          <Text color="green">{t('input.submit')}: {message}</Text>
        </Box>
      )}
      {repoName && (
        <Box marginTop={0} marginBottom={0}>
          <Text color="gray">{t('common.repository')}: {repoName}</Text>
        </Box>
      )}
    </Box>
  );
};

export default TerminalInterface;





