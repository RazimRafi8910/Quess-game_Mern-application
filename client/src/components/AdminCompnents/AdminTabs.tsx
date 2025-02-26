    
interface AdminTabProps {
    handleTabChange: (tab: number) => void
    currentTab: number
}

function AdminTabs({handleTabChange,currentTab}:AdminTabProps) {
    const tabs = ['Create Questions','Qestions', 'Category', 'Users'];
    
    return (
        <>
            <div className="bg-neutral-400/[0.5] ">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <ul
                    className="flex flex-wrap -mb-px text-sm font-medium text-center"
                    id="default-tab"
                    data-tabs-toggle="#default-tab-content"
                    role="tablist"
                    >
                        {tabs.map((tab, index) => (
                            <li className="me-2" key={index} role="presentation">
                                <button
                                    className={"inline-block text-slate-300 p-4 hover:border-b-2 rounded-t-lg min-w-30" + (index == currentTab ? " text-blue-600 border-b-2 border-blue-500" :"hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300")}
                                    type="button"
                                    onClick={()=>{handleTabChange(index)}}
                                    role="tab"
                                >
                                    {tab}
                                </button>
                            </li>        
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default AdminTabs;
