import { Choice } from "@/types";

const getParticipantsIdsStillChoosing = (
  participantsIds: string[],
  choices: Choice[]
) => {
  const participantsWithConfirmedChoices = choices
    .filter(
      (choice) =>
        // For double check also filter out choices of potential guests who abandoned the room or were kicked. This situation shouldn't have a place because during abandoning the room, the choice of abandoning user is erased. Left to double-check.
        choice.confirmed && participantsIds.includes(choice.userId)
    )
    .map((choice) => choice.userId);

  return participantsIds.filter(
    (participantId) => !participantsWithConfirmedChoices.includes(participantId)
  );
};

export default getParticipantsIdsStillChoosing;
