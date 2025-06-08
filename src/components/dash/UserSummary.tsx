interface Props {
  user: {
    name: string;
    email: string;
    country: string;
    vip: boolean;
    uid: string;
  };
}

export default function UserSummary({ user }: Props) {
  return (
    <section className="w-full bg-zinc-900 border border-orange-600 rounded-xl p-4 shadow-lg">
      <h2 className="text-xl font-bold text-orange-500 mb-2">Welcome, {user.name}</h2>
      <div className="space-y-1 text-sm text-gray-300">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Country:</strong> {user.country}</p>
        <p><strong>Plan:</strong> {user.vip ? "Premium" : "Free"}</p>
        <p><strong>API Status:</strong> Inactive</p>
        <p><strong>Requests:</strong> 0</p>
      </div>
    </section>
  );
}
