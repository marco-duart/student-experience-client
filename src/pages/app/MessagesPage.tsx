import { useState } from "react";
import { Send, MessageSquare, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { styled } from "@/theme/stitches.config";
import { accountService } from "@/services/user.service";
import { useAuth } from "@/contexts/auth-context";
import { useAsyncAction } from "@/hooks/use-async-action";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  PageContent,
  EmptyState,
  EmptyStateTitle,
  EmptyStateText,
} from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Message = {
  id: number;
  content: string;
  sender_id: number;
  receiver_id: number;
  checked: boolean;
  created_at: string;
};

const ChatBubble = styled("div", {
  maxWidth: "80%",
  padding: "$3 $4",
  borderRadius: "18px",
  fontSize: "$sm",
  lineHeight: 1.5,
  wordBreak: "break-word",

  variants: {
    mine: {
      true: {
        backgroundColor: "$primary",
        color: "#fff",
        borderBottomRightRadius: "4px",
        alignSelf: "flex-end",
      },
      false: {
        backgroundColor: "$bgPaper",
        color: "$textPrimary",
        border: "1px solid $divider",
        borderBottomLeftRadius: "4px",
        alignSelf: "flex-start",
      },
    },
  },
});

const ChatTime = styled("span", {
  fontSize: "10px",
  color: "$textDisabled",
  display: "block",
  marginTop: "2px",

  variants: {
    mine: {
      true: { textAlign: "right" },
      false: { textAlign: "left" },
    },
  },
});

const ChatList = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$3",
  padding: "$4",
});

const SendBar = styled("div", {
  position: "fixed",
  bottom: "62px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "100%",
  maxWidth: "480px",
  padding: "$3",
  backgroundColor: "$bgPaper",
  borderTop: "1px solid $divider",
  display: "flex",
  gap: "$2",
  alignItems: "center",
});

const SearchRow = styled("div", {
  padding: "$4 $4 0",
  display: "flex",
  gap: "$2",
});

export default function MessagesPage() {
  const { user } = useAuth();
  const [receiverId, setReceiverId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searching, setSearching] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const { loading: loadingMessages, run: loadMessages } = useAsyncAction(
    async () => {
      if (!user || !receiverId.trim()) return;
      setSearching(true);
      const res = await accountService.fetchMessages(
        user.id,
        Number(receiverId),
      );
      if (res.success) {
        const arr = Array.isArray(res.data) ? res.data : [];
        setMessages(
          arr.map((m) => {
            const msg = m as Record<string, unknown>;
            return {
              id: Number(msg.id),
              content: String(msg.content ?? ""),
              sender_id: Number(msg.sender_id),
              receiver_id: Number(msg.receiver_id),
              checked: Boolean(msg.checked),
              created_at: String(msg.created_at ?? ""),
            };
          }),
        );
        setHasLoaded(true);
      } else {
        toast.error(res.message || "Erro ao carregar mensagens.");
      }
      setSearching(false);
    },
  );

  const { loading: sending, run: sendMessage } = useAsyncAction(async () => {
    if (!user || !newMessage.trim() || !receiverId.trim()) return;
    const res = await accountService.sendMessage({
      sender_id: user.id,
      receiver_id: Number(receiverId),
      content: newMessage.trim(),
    });
    if (res.success) {
      setNewMessage("");
      await loadMessages();
    } else {
      toast.error(res.message || "Erro ao enviar mensagem.");
    }
  });

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <>
      <AppHeader title="Mensagens" />
      <PageContent noPadding>
        <SearchRow>
          <Input
            placeholder="ID do destinatário"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            inputMode="numeric"
            style={{ flex: 1 }}
          />
          <Button
            size="md"
            style={{ width: "auto", paddingLeft: "16px", paddingRight: "16px" }}
            loading={loadingMessages || searching}
            onClick={() => loadMessages()}
          >
            <Search size={18} />
          </Button>
        </SearchRow>

        {!hasLoaded ? (
          <EmptyState>
            <MessageSquare size={40} color="var(--colors-textDisabled)" />
            <EmptyStateTitle>Suas mensagens</EmptyStateTitle>
            <EmptyStateText>
              Informe o ID do destinatário e carregue a conversa.
            </EmptyStateText>
          </EmptyState>
        ) : messages.length === 0 ? (
          <EmptyState>
            <MessageSquare size={40} color="var(--colors-textDisabled)" />
            <EmptyStateTitle>Sem mensagens</EmptyStateTitle>
            <EmptyStateText>
              Inicie a conversa enviando a primeira mensagem.
            </EmptyStateText>
          </EmptyState>
        ) : (
          <ChatList>
            {messages.map((msg) => {
              const isMine = msg.sender_id === user?.id;
              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMine ? "flex-end" : "flex-start",
                  }}
                >
                  <ChatBubble mine={isMine}>{msg.content}</ChatBubble>
                  <ChatTime mine={isMine}>
                    {formatTime(msg.created_at)}
                  </ChatTime>
                </div>
              );
            })}
          </ChatList>
        )}
      </PageContent>

      {hasLoaded && (
        <SendBar>
          <input
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "24px",
              border: "1.5px solid var(--colors-divider)",
              fontSize: "15px",
              outline: "none",
              backgroundColor: "var(--colors-bgDefault)",
            }}
            placeholder="Digite uma mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={sending || !newMessage.trim()}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: "var(--colors-primary)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              opacity: sending || !newMessage.trim() ? 0.5 : 1,
            }}
          >
            <Send size={18} color="#fff" />
          </button>
        </SendBar>
      )}
    </>
  );
}
