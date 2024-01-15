import {
  setupRecording,
  Recording,
  SetupRecordingInput,
  mutations,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupProjectRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    redactedRequestHeaders: ['Authorization'],
    redactedResponseHeaders: ['set-cookie'],
    options: {
      matchRequestsBy: {
        url: false,
      },
    },
    mutateEntry: (entry) => {
      redact(entry);
    },
  });
}

// a more sophisticated redaction example below:

function getRedactedOAuthResponse() {
  return {
    access_token: '[REDACTED]',
    expires_in: 9999,
    token_type: 'Bearer',
  };
}

function redact(entry): void {
  if (entry.request.postData) {
    entry.request.postData.text = '[REDACTED]';
  }

  if (!entry.response.content.text) {
    return;
  }

  //let's unzip the entry so we can modify it
  mutations.unzipGzippedRecordingEntry(entry);

  //we can just get rid of all response content if this was the token call
  const requestUrl = entry.request.url;
  if (requestUrl.match(/oauth\/token/)) {
    entry.response.content.text = JSON.stringify(getRedactedOAuthResponse());
    return;
  }

  //if it wasn't a token call, parse the response text, removing any carriage returns or newlines
  const responseText = entry.response.content.text;
  const parsedResponseText = JSON.parse(responseText.replace(/\r?\n|\r/g, ''));

  if (parsedResponseText) {
    if (parsedResponseText.access_token) {
      parsedResponseText.access_token = '[REDACTED]';
    }
  }

  entry.response.content.text = JSON.stringify(parsedResponseText);
}
