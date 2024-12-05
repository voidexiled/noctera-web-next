import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ServerInfo() {

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Server info</CardTitle>
        </CardHeader>
        <CardContent className="p-2 space-y-2">


          <Tabs defaultValue="server_info" className="w-full">
            <TabsList className="w-full justify-start px-1">
              <TabsTrigger value="server_info">Server Information</TabsTrigger>
              <TabsTrigger value="rates">Rates</TabsTrigger>
              <TabsTrigger value="viprates">Vip bonus rates</TabsTrigger>
              <TabsTrigger value="pvp_information">PVP Information</TabsTrigger>
              <TabsTrigger value="stages">Stages</TabsTrigger>
              <TabsTrigger value="party_system">Party system</TabsTrigger>
            </TabsList>

            <TabsContent value="server_info">
              <div className="flex flex-col rounded-sm border">
                <div className='flex p-2 items-start justify-start  bg-background text-sm'>
                  Server Information
                </div>
                <Table>
                  <TableBody>
                    {/* <TableRow>
                      <TableCell className="w-[130px]">IP:</TableCell>
                      <TableCell>IP AQUI</TableCell>
                    </TableRow> */}
                    <TableRow>
                      <TableCell className="w-[130px]">Cliente:</TableCell>
                      <TableCell>13.40</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">Server type:</TableCell>
                      <TableCell className="capitalize">Open PVP</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">Protection level:</TableCell>
                      <TableCell className="capitalize">80</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">Stamina:</TableCell>
                      <TableCell><span>Green: 2 stamina each 3 minutes</span><br/><span>Orange: 2 stamina each 5 minutes</span></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="rates">
              <div className="flex flex-col rounded-sm border">
                <div className='flex p-2 items-start justify-start  bg-background text-sm'>
                  Rates
                </div>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="w-[130px]">Exp rate:</TableCell>
                      <TableCell>Stages</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">Magic level:</TableCell>
                      <TableCell>160.0x - 1.5x </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">Skills:</TableCell>
                      <TableCell>180.0x - 2.0x</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">Loot:</TableCell>
                      <TableCell>3.0x</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="viprates">
              <div className="flex flex-col rounded-sm border">
                <div className='flex p-2 items-start justify-start  bg-background text-sm'>
                  Vip bonus rates
                </div>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="w-[130px]">Exp bonus:</TableCell>
                      <TableCell>+12%</TableCell>
                    </TableRow>
 
                    <TableRow>
                      <TableCell className="w-[130px]">Skill bonus:</TableCell>
                      <TableCell>+14%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">Loot bonus:</TableCell>
                      <TableCell>+17%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="pvp_information">
              <div className="flex flex-col rounded-sm border">
                <div className='flex p-2 items-start justify-start  bg-background text-sm'>
                  PVP Information
                </div>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="w-[130px]">PZ Locked:</TableCell>
                      <TableCell>1 minute</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">White skull:</TableCell>
                      <TableCell>2 minutes</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">Red skull:</TableCell>
                      <TableCell>3 days</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">Black skull:</TableCell>
                      <TableCell>10 days</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">Red skull max:</TableCell>
                      <TableCell>5 kills</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">bacl skull max:</TableCell>
                      <TableCell>10 kills</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="stages">
              <div className="flex flex-col rounded-sm border">
                <div className='flex p-2 items-start justify-start  bg-background text-sm'>
                  Stages
                </div>
                <Table>
                  <TableHeader className="pointer-events-none">
                    <TableRow>
                      <TableHead>Level</TableHead>
                      <TableHead>Stages</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="w-[130px]">1-45:</TableCell>
                      <TableCell>90x</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">46-80:</TableCell>
                      <TableCell>70x</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">81-130:</TableCell>
                      <TableCell>55x</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">131-180:</TableCell>
                      <TableCell>25x</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">181-200:</TableCell>
                      <TableCell>15x</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">251-300:</TableCell>
                      <TableCell>7x</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">301-350:</TableCell>
                      <TableCell>5x</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">351-450:</TableCell>
                      <TableCell>3x</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">451-500:</TableCell>
                      <TableCell>2x</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-[130px]">501+:</TableCell>
                      <TableCell>1.5x</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="party_system">
              <div className="flex flex-col rounded-sm border">
                <div className='flex p-2 items-start justify-start  bg-background text-sm'>
                  Party System
                </div>
                <Table className="text-center">
                  <TableBody>
                    <TableRow>
                      <TableCell><b>from 2 to 5 players with different vocations</b></TableCell>
                      <TableCell>Receive 100% of bônus the exp</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><b>6 or more players</b></TableCell>
                      <TableCell>15% break for every player that joins</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>


        </CardContent>
      </Card>
    </>
  )
}