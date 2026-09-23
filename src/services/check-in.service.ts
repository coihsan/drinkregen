export interface EventParticipant {
  invitationCode: string;
  name: string;
  company: string;
  checkedInAt?: string;
}

export type QRValidationResult =
  | {
      status: "valid";
      participant: EventParticipant;
    }
  | {
      status: "already_checked_in";
      participant: EventParticipant;
    }
  | {
      status: "not_found";
      invitationCode: string;
    }
  | {
      status: "invalid_format";
      rawValue: string;
    };

export interface CheckInResult {
  participant: EventParticipant;
}

const CHECKED_IN_STORAGE_KEY = "regen-event-checked-in";

const PARTICIPANTS: EventParticipant[] = [
  {
    invitationCode: "RGN-00123",
    name: "Budi Santoso",
    company: "PT ABC",
  },
  {
    invitationCode: "RGN-00124",
    name: "Siti Rahma",
    company: "PT Maju Jaya",
  },
  {
    invitationCode: "RGN-00125",
    name: "Andi Wijaya",
    company: "CV Nusantara",
  },
];

const normalizeInvitationCode = (value: string) => value.trim().toUpperCase();

const readCheckedInParticipants = (): Record<string, string> => {
  if (typeof localStorage === "undefined") {
    return {};
  }

  const value = localStorage.getItem(CHECKED_IN_STORAGE_KEY);

  if (!value) {
    return {};
  }

  try {
    return JSON.parse(value) as Record<string, string>;
  } catch {
    return {};
  }
};

const writeCheckedInParticipants = (value: Record<string, string>) => {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(CHECKED_IN_STORAGE_KEY, JSON.stringify(value));
};

export const parseInvitationCodeFromQR = (rawValue: string): string | null => {
  const trimmedValue = rawValue.trim();

  if (!trimmedValue) {
    return null;
  }

  try {
    const payload = JSON.parse(trimmedValue) as {
      invitationCode?: unknown;
      invitation?: unknown;
      code?: unknown;
    };

    const code = payload.invitationCode || payload.invitation || payload.code;

    if (typeof code === "string") {
      return normalizeInvitationCode(code);
    }
  } catch {
    // QR juga boleh berisi teks biasa atau URL, bukan hanya JSON.
  }

  try {
    const url = new URL(trimmedValue);
    const code =
      url.searchParams.get("invitation") ||
      url.searchParams.get("invitationCode") ||
      url.searchParams.get("code");

    if (code) {
      return normalizeInvitationCode(code);
    }
  } catch {
    // Bukan URL.
  }

  if (/^RGN-\d{5}$/i.test(trimmedValue)) {
    return normalizeInvitationCode(trimmedValue);
  }

  return null;
};

export const validateParticipantQRCode = (
  rawValue: string,
): QRValidationResult => {
  const invitationCode = parseInvitationCodeFromQR(rawValue);

  if (!invitationCode) {
    return {
      status: "invalid_format",
      rawValue,
    };
  }

  const participant = PARTICIPANTS.find(
    (item) => item.invitationCode === invitationCode,
  );

  if (!participant) {
    return {
      status: "not_found",
      invitationCode,
    };
  }

  const checkedInParticipants = readCheckedInParticipants();
  const checkedInAt = checkedInParticipants[invitationCode];
  const participantWithStatus = {
    ...participant,
    checkedInAt,
  };

  if (checkedInAt) {
    return {
      status: "already_checked_in",
      participant: participantWithStatus,
    };
  }

  return {
    status: "valid",
    participant: participantWithStatus,
  };
};

export const checkInParticipant = (
  invitationCode: string,
): CheckInResult | null => {
  const normalizedCode = normalizeInvitationCode(invitationCode);
  const participant = PARTICIPANTS.find(
    (item) => item.invitationCode === normalizedCode,
  );

  if (!participant) {
    return null;
  }

  const checkedInAt = new Date().toISOString();
  const checkedInParticipants = readCheckedInParticipants();

  checkedInParticipants[normalizedCode] = checkedInAt;
  writeCheckedInParticipants(checkedInParticipants);

  return {
    participant: {
      ...participant,
      checkedInAt,
    },
  };
};

export const formatCheckInTime = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
    timeZoneName: "short",
  }).format(new Date(value));
