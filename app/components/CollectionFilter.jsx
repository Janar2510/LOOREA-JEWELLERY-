import {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useNavigate, useLocation} from 'react-router';

export function CollectionFilter({filters = [], onFilter}) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category' || 'ALL'));

  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'ALL');
  }, [location.search]);

  const categories = ['ALL', 'NEW ARRIVALS', 'BESTSELLERS', 'ARCHIVE', 'ZODIAC'];
  const materials = ['Silver', 'Gold'];

  const handleFilter = (key, value) => {
    const params = new URLSearchParams(location.search);
    if (value === 'ALL') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true, scroll: false });
    onFilter?.({[key]: value});
  };

  return (
    <div className="collection-filter w-full py-20 border-b border-foreground/5 mb-24">
      <div className="flex flex-col md:flex-row items-center justify-between gap-16">
        
        {/* STYLE SELECTOR */}
        <div className="flex items-center gap-12 overflow-x-auto no-scrollbar w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter('category', cat)}
              className="group relative flex flex-col items-start gap-1 flex-shrink-0"
            >
              <span className={`text-[10px] uppercase tracking-[0.4em] transition-all duration-700 ${
                activeCategory === cat ? 'text-accent font-bold' : 'text-foreground/40 group-hover:text-foreground'
              }`}>
                {cat}
              </span>
              <motion.div 
                initial={false}
                animate={{ 
                  width: activeCategory === cat ? '100%' : '0%',
                  opacity: activeCategory === cat ? 1 : 0
                }}
                className="h-[1px] bg-accent"
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-16 w-full md:w-auto justify-between md:justify-end">
          {/* MATERIAL/FINISH TOGGLE */}
          <div className="flex items-center gap-10">
             <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-20 italic">Finishes</span>
             <div className="flex items-center gap-6">
                {materials.map(mat => {
                  const isActive = searchParams.get('material') === mat;
                  return (
                    <button 
                      key={mat}
                      onClick={() => handleFilter('material', isActive ? 'ALL' : mat)}
                      className={`text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-1 border transition-all duration-500 rounded-full ${
                        isActive ? 'border-accent text-accent' : 'border-foreground/5 hover:border-accent hover:text-accent'
                      }`}
                    >
                      {mat}
                    </button>
                  );
                })}
             </div>
          </div>

          {/* METADATA COUNT */}
          <div className="hidden lg:block">
            <span className="text-[9px] uppercase tracking-[0.6em] text-foreground/20 font-medium italic">
              Discovery Engine Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
