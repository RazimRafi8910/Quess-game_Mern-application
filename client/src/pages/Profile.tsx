import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import HomeButton from "../components/Buttons/HomeButton";
import Loader from "../components/Loader";
import { logoutUser } from "../store/slice/userSlice";
import getBackendURL from "../utils/getBackend";
import getHttpErrorMessage from "../utils/getHttpErrorMessage";
import { removeUserLocalStorage } from "../utils/localStateManager";
import { UserDetailsType } from "../types";

const API = getBackendURL();

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDetailsType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API}/user`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok || result?.success === false) {
          throw new Error(result?.message || getHttpErrorMessage(response.status));
        }

        const details: UserDetailsType | undefined = result?.userDetails;
        if (!details) {
          throw new Error("User details not found");
        }

        if (mounted) {
          setUser(details);
        }
      } catch (e) {
        if (!mounted) return;
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("something went wrong");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUser();
    return () => {
      mounted = false;
    };
  }, []);

  const isAdmin = useMemo(() => user?.role === "admin", [user?.role]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch(`${API}/user/logout`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || getHttpErrorMessage(response.status));
      }

      removeUserLocalStorage();
      dispatch(logoutUser());
      navigate("/login");
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("something went wrong");
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 md:px-6 py-10 text-white">
      <div className="relative overflow-hidden rounded-3xl border border-zinc-700 bg-slate-900/[0.22] shadow-2xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-24 h-56 w-56 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-emerald-600/15 blur-3xl" />
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl border border-slate-700 bg-slate-950/60 grid place-items-center shadow-md">
                <span className="text-xl font-black text-slate-100">
                  {(user?.username?.[0] || "U").toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {user?.username || "Profile"}
                </h2>
                <p className="text-sm text-slate-300">
                  {user?.email || "Your account details"}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <HomeButton
                content="Go Home"
                buttonType="button"
                onClick={() => navigate("/")}
                className="w-full sm:w-auto"
              />
              {isAdmin && (
                <HomeButton
                  content="Admin Panel"
                  buttonType="button"
                  onClick={() => navigate("/admin")}
                  className="w-full sm:w-auto"
                  backGround="bg-gradient-to-tl from-emerald-700 to-slate-700 hover:from-emerald-800 hover:to-slate-600"
                />
              )}
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-700 bg-slate-950/60 px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">Username</p>
              <p className="mt-1 text-lg font-semibold text-slate-100 break-words">
                {user?.username || "-"}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-700 bg-slate-950/60 px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">Email</p>
              <p className="mt-1 text-lg font-semibold text-slate-100 break-words">
                {user?.email || "-"}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-700 bg-slate-950/60 px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">Role</p>
              <div className="mt-2 inline-flex items-center gap-2">
                <span className="inline-flex rounded-full border border-slate-600 bg-slate-900/40 px-3 py-1 text-sm font-semibold text-slate-100">
                  {user?.role || "-"}
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-700 bg-slate-950/60 px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">User ID</p>
              <p className="mt-1 text-sm font-semibold text-slate-100 break-all">
                {user?.id || "-"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-700 bg-slate-950/60 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-200">Game history</p>
                <p className="text-xs text-slate-400">Your recent results.</p>
              </div>
              <span className="inline-flex rounded-full border border-slate-700 bg-slate-900/40 px-3 py-1 text-xs font-semibold text-slate-200">
                {(user?.gameHistory?.length || 0).toString()} games
              </span>
            </div>

            {user?.gameHistory && user.gameHistory.length > 0 ? (
              <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-900/40 text-slate-300">
                    <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-xs [&>th]:uppercase [&>th]:tracking-wider">
                      <th>Game</th>
                      <th>Date</th>
                      <th className="text-right">Score</th>
                      <th className="text-right">Correct</th>
                      <th className="text-right">Incorrect</th>
                      <th className="text-right">Not attended</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-100">
                    {user.gameHistory
                      .slice()
                      .sort((a, b) => (b.gameEndAt || 0) - (a.gameEndAt || 0))
                      .map((h) => {
                        const when =
                          typeof h?.gameEndAt === "number" && h.gameEndAt > 0
                            ? new Date(h.gameEndAt).toLocaleString()
                            : h?.createdAt
                              ? new Date(h.createdAt).toLocaleString()
                              : "-";
                        let gameDate;
                        const currentDay = Date.now()
                        if(currentDay == h.gameEndAt){
                          gameDate = when.split(',')[1];
                        } else {
                          gameDate = when.split(',')[0];
                        }
                        return (
                          <tr
                            key={h._id}
                            className="bg-slate-950/20 hover:bg-slate-900/30 transition-colors [&>td]:px-4 [&>td]:py-3"
                          >
                            <td className="whitespace-nowrap">
                              <span className="inline-flex rounded-lg border border-slate-700 bg-slate-900/30 px-2 py-1 text-xs font-semibold text-slate-200">
                                {h.gameId || "-"}
                              </span>
                            </td>
                            <td className="whitespace-nowrap text-slate-200">{gameDate}</td>
                            <td className="text-right font-semibold">
                              {h.gameResult?.score ?? "-"}
                            </td>
                            <td className="text-right">{h.gameResult?.correct ?? "-"}</td>
                            <td className="text-right">{h.gameResult?.incorrect ?? "-"}</td>
                            <td className="text-right">{h.gameResult?.notAttended ?? "-"}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-4">
                <p className="text-sm text-slate-300">No games yet.</p>
                <p className="mt-1 text-xs text-slate-400">
                  Play a game and your results will show up here.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-800 pt-6">
            <div>
              <p className="text-sm font-semibold text-slate-200">Account actions</p>
              <p className="text-xs text-slate-400">Logout will end your session on this device.</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full sm:w-auto rounded-xl px-6 py-3 text-base font-bold border border-red-900 text-white transition-all shadow-md hover:shadow-lg bg-gradient-to-tl from-red-700 to-slate-800 hover:from-red-800 hover:to-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;