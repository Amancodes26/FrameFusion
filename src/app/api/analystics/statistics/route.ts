import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { format } from "date-fns";


// fetch the statistics of usage based on queryparam month weekly yaerly

export async function GET (request:NextRequest) {
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({error: "You are Unauthorized"},{ status:401});
    }
    const id = session.user.id;
    const {searchParams}=  new URL(request.url);
    const period = searchParams.get('period') || 'monthly';  
     try {
        const statistics = await prisma.post.findMany({
            where:{userId:id},
            select:{createdAt:true},
        })
        const now = new Date();
        let filteredStats = statistics;
        if (period!=='monthly' && period !=='weekly' && period !=='yearly'){
            return NextResponse.json({error:"Invalid period parameter"},{status:400});
        }
        if(period === 'monthly'){
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() -1);
            filteredStats = statistics.filter((stat: { createdAt: Date }) => stat.createdAt >= oneMonthAgo);
        }
        else if(period === 'weekly'){
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate()-7);
            filteredStats = statistics.filter((stat: { createdAt: Date }) => stat.createdAt >= oneWeekAgo);
        }
        else if(period === 'yearly'){
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(now.getFullYear() - 1);
            filteredStats = statistics.filter((stat: { createdAt: Date }) => stat.createdAt >= oneYearAgo);
        }

        const grouped: Record<string, number> = {};
        for (const post of filteredStats) {
      let key: string;

      if (period === "weekly") {
        key = format(post.createdAt, "yyyy-MM-dd"); // group by day
      } else if (period === "monthly") {
        key = format(post.createdAt, "yyyy-MM"); // group by month
      } else {
        key = format(post.createdAt, "yyyy"); // group by year
      }

      grouped[key] = (grouped[key] || 0) + 1;
    }

        return NextResponse.json({ statistics: grouped });



        
    } catch {
        return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
    }
}
