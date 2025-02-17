import { useState, useEffect } from "react";

const Counter = ({ value, type }) => 
{
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    const incrementTime = Math.floor(2000 / end);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span className="lg:text-4xl md:text-2xl text-lg font-semibold">{count +(type === 'percent' ? '%' : '+')}</span>;
};

const StatSection = () => 
{

  return (  
      <div className="container mx-auto rounded-lg flex justify-around text-center my-8">
        <div>
          <h2 className="md:text-base text-sm md:pb-3 pb-1 text-muted-foreground font-semibold">Countries</h2>
          <Counter value={25} />
        </div>
        <div>
          <h2 className="md:text-base text-sm md:pb-3 pb-1 text-muted-foreground font-semibold">Batches</h2>
          <Counter value={150}/>
        </div>
        <div>
          <h2 className="md:text-base text-sm md:pb-3 pb-1 text-muted-foreground font-semibold">Achievers</h2>
          <Counter value={1500}/>
        </div>
        <div>
          <h2 className="md:text-base text-sm md:pb-3 pb-1 text-muted-foreground font-semibold">Success Rate</h2>
          <Counter value={92} type="percent"/>
        </div>
      </div>
  );
};

export default StatSection;
