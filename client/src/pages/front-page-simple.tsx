import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function FrontPageSimple() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">POLIPUS®</h1>
          <p className="text-xl text-slate-600 mb-8">General Environmental Intelligence Platform</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/portals">
              <Button className="w-full h-20 text-lg bg-green-600 hover:bg-green-700">
                Agricultural Traceability & Compliance
              </Button>
            </Link>
            
            <Link href="/live-trace">
              <Button className="w-full h-20 text-lg bg-blue-600 hover:bg-blue-700">
                Live Trace - Coming Soon
              </Button>
            </Link>
            
            <Link href="/landmap360-portal">
              <Button className="w-full h-20 text-lg bg-purple-600 hover:bg-purple-700">
                Land Map360 - Coming Soon
              </Button>
            </Link>
            
            <Link href="/mine-watch">
              <Button className="w-full h-20 text-lg bg-orange-600 hover:bg-orange-700">
                Mine Watch - Coming Soon
              </Button>
            </Link>
          </div>
          
          <div className="mt-8">
            <Link href="/field-agent-login">
              <Button variant="outline" className="mr-4">
                Field Agent Login
              </Button>
            </Link>
            <Link href="/farmer-login">
              <Button variant="outline">
                Farmer Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}