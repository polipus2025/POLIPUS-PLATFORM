import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, MapPin, Star, TrendingUp, Phone, Mail, Package2 } from "lucide-react";

export default function BuyerExporterNetwork() {
  // MARKETPLACE DISABLED - Democratic system only
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Marketplace Non Disponibile</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Sistema Democratico Attivo</h3>
              <p className="text-blue-800 mb-4">
                Il contatto diretto con i farmer tramite marketplace è stato disabilitato. Tutte le connessioni farmer-buyer ora funzionano attraverso il nostro sistema democratico di notifiche.
              </p>
              <div className="text-left">
                <h4 className="font-semibold text-blue-900 mb-2">Come funziona:</h4>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>I farmer inviano le offerte prodotti nella loro dashboard</li>
                  <li>Tutti i buyer nella stessa contea vengono notificati automaticamente</li>
                  <li>Il primo buyer che accetta l'offerta vince la transazione</li>
                  <li>Processo equo e trasparente per tutti</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">
              Controlla la tua sezione <strong>Product Offers</strong> nella buyer dashboard per vedere le notifiche dei farmer.
            </p>
            <a href="/agricultural-buyer-dashboard" 
               className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Vai alla Buyer Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}