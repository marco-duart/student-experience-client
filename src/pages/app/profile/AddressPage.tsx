import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Save } from "lucide-react";
import { accountService } from "@/services/user.service";
import { useAuth } from "@/contexts/auth-context";
import { useAsyncAction } from "@/hooks/use-async-action";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageContent } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { styled } from "@/theme/stitches.config";

const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "$4",
});

export default function AddressPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [form, setForm] = useState({
    street: "",
    district: "",
    zip_code: "",
    city: "",
    state: "",
    country: "Brasil",
    number: "",
    complement: "",
  });

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [f]: e.target.value }));

  useEffect(() => {
    if (!user) return;
    accountService.showAddress(user.id).then((res) => {
      if (res.success && res.data) {
        const addr = res.data;
        setAddressId(
          ((addr as Record<string, unknown>).address_id as number) ?? null,
        );
        setForm({
          street: String((addr as Record<string, unknown>).street ?? ""),
          district: String((addr as Record<string, unknown>).district ?? ""),
          zip_code: String((addr as Record<string, unknown>).zip_code ?? ""),
          city: String((addr as Record<string, unknown>).city ?? ""),
          state: String((addr as Record<string, unknown>).state ?? ""),
          country: String(
            (addr as Record<string, unknown>).country ?? "Brasil",
          ),
          number: String((addr as Record<string, unknown>).number ?? ""),
          complement: String(
            (addr as Record<string, unknown>).complement ?? "",
          ),
        });
      }
      setLoading(false);
    });
  }, [user]);

  const { loading: saving, run: handleSubmit } = useAsyncAction(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      const res = await accountService.updateAddress({
        account_id: user.id,
        address: {
          address_id: addressId,
          street: form.street,
          district: form.district,
          zip_code: form.zip_code,
          city: form.city,
          state: form.state,
          country: form.country,
          number: form.number,
          complement: form.complement,
        },
      });
      if (res.success) {
        toast.success("Endereço salvo!");
        await refreshUser({
          ...user,
          address: { ...form, address_id: addressId ?? undefined },
        });
        navigate(-1);
      } else {
        toast.error(res.message || "Erro ao salvar endereço.");
      }
    },
  );

  if (loading) return <Spinner fullScreen label="Carregando endereço..." />;

  return (
    <>
      <AppHeader title="Endereço" showBack />
      <PageContent>
        <Form onSubmit={handleSubmit}>
          <Input
            label="CEP"
            value={form.zip_code}
            onChange={set("zip_code")}
            inputMode="numeric"
            placeholder="00000-000"
          />
          <Input
            label="Rua"
            value={form.street}
            onChange={set("street")}
            placeholder="Rua das Flores"
          />
          <Input
            label="Número"
            value={form.number}
            onChange={set("number")}
            placeholder="123"
            inputMode="numeric"
          />
          <Input
            label="Complemento"
            value={form.complement}
            onChange={set("complement")}
            placeholder="Apto 4B"
          />
          <Input
            label="Bairro"
            value={form.district}
            onChange={set("district")}
            placeholder="Centro"
          />
          <Input
            label="Cidade"
            value={form.city}
            onChange={set("city")}
            placeholder="São Paulo"
          />
          <Input
            label="Estado"
            value={form.state}
            onChange={set("state")}
            placeholder="SP"
          />
          <Input label="País" value={form.country} onChange={set("country")} />
          <Button type="submit" loading={saving} leftIcon={<Save size={18} />}>
            Salvar endereço
          </Button>
        </Form>
      </PageContent>
    </>
  );
}
