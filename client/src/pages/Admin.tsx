import { useEffect, useState } from "react";
import AdminTabs from "../components/AdminCompnents/adminTabs";
import QuestionDiv from "../components/AdminCompnents/QuestionDiv";
import QuestionForm from "../components/AdminCompnents/QuestionForm";
import { motion, AnimatePresence } from 'framer-motion'
import CategoryTab from "../components/AdminCompnents/CategoryTab";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import UserTab from "../components/AdminCompnents/UserTab";

function Admin() {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const userDetails = useSelector((state: RootState) => state.userReducer);
  const naviage = useNavigate()

  useEffect(() => {
    console.log(userDetails)
    if (!userDetails.logined) {
      naviage('/login');
    } else if (userDetails.user?.role !== 'admin') {
      naviage('/');
    }
  },[])

  const renderCurrentTab = (tab: number)=>{
    switch (tab) {
      case 0:
        return <QuestionForm />
      case 1:
        return <QuestionDiv />
      case 2:
        return <CategoryTab />
      case 3:
        return <UserTab />
      default:
        return <p className="text-white text-center py-10">No Tabs Found</p>
    }
  }

  const handleTabChange = (tab:number) => {
    setCurrentTab(tab);
  }

  return (
    <>
      <div className="mx-2 md:mx-40">
        <AdminTabs handleTabChange={handleTabChange} currentTab={ currentTab } />
        <div className="bg-slate-600/[0.4] min-h-screen">
          <AnimatePresence>
            <motion.div
              key={currentTab}
              initial={{ opacity: 0,}}
              animate={{ opacity: 1,}}
              exit={{ opacity: 0, }}
              transition={{ duration: 0.2 }}
              className="">
              {renderCurrentTab(currentTab)}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* <QuestionForm/> */}
      {/* <div className="mt-5">
        <div className="text-center">
        <h1 className="text-white text-2xl ">All question</h1>
        <QuestionDiv/>
        <QuestionDiv/>
        </div>
        </div> */}
      </div>
    </>
  );
}

export default Admin;
