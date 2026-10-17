import { Crown, Circle } from "lucide-react";
import Avatar from "../ui/Avatar";
export default function UserList({ users = [] }) {
  return <div className="space-y-4">{users.map((user, index) => <div key={user.id || user.name} className="flex items-center gap-3"><Avatar name={user.name} index={index}/><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{user.name}</p><p className="mt-1 text-xs muted">{user.role || "Listener"}</p></div>{user.host ? <Crown size={16} className="text-violet-300"/> : <Circle size={8} className="fill-emerald-300 text-emerald-300"/>}</div>)}</div>;
}
