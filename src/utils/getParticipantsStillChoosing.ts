import { Choice } from "@/types";

const getParticipantsIdsStillChoosing = (
  participantsIds: string[],
  choices: Choice[]
) => {
  const participantsWithConfirmedChoices = choices
    .filter(
      (choice) =>
        // For double check also filtering out choices of potential guest which abandoned the room.
        choice.confirmed && participantsIds.includes(choice.userId)
    )
    .map((choice) => choice.userId);

  return participantsIds.filter(
    (participantId) => !participantsWithConfirmedChoices.includes(participantId)
  );
};

export default getParticipantsIdsStillChoosing;
