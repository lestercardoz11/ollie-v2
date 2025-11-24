import Landing from '@/components/landing';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims ? data.claims : null;

  return <Landing user={user} />;
}
