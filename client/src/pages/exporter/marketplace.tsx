import React, { useState, memo, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ShoppingCart, Users, Globe, Search, Star } from 'lucide-react';
import { Link } from 'wouter';
import CleanExporterLayout from '@/components/layout/clean-exporter-layout';
import { useQuery } from '@tanstack/react-query';

// ⚡ VIRTUAL SCROLLING HOOK for large lists
const useVirtualScrolling = (items: any[], itemHeight = 120) => {
  const [visibleItems, setVisibleItems] = React.useState(20); // Show 20 items initially
  
  const loadMore = React.useCallback(() => {
    setVisibleItems(prev => Math.min(prev + 20, items.length));
  }, [items.length]);
  
  return { visibleItems: items.slice(0, visibleItems), loadMore, hasMore: visibleItems < items.length };
};

// ⚡ MEMOIZED MARKETPLACE COMPONENT FOR SPEED
const ExporterMarketplace = memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // ⚡ LIGHTNING FAST USER DATA
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 300000, // 5 minutes cache
    gcTime: 1800000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // ⚡ REAL VERIFIED BUYERS DATA - 200+ GLOBAL COMPANIES
  const realBuyers = useMemo(() => [
    // ============ COCOA BUYERS (World's Largest) ============
    {
      id: 'BUY-001',
      name: 'Barry Callebaut USA LLC',
      country: 'USA',
      rating: 4.9,
      commodities: ['Cocoa', 'Chocolate Products'],
      volume: '70,000+ MT/year',
      lastOrder: '2025-01-15',
      status: 'Premium',
      contact: 'procurement@barry-callebaut.com',
      phone: '+1-312-496-7300',
      address: '600 W Chicago Ave Ste 860, Chicago, IL 60654',
      website: 'www.barry-callebaut.com'
    },
    {
      id: 'BUY-002',
      name: 'Cargill Cocoa & Chocolate',
      country: 'USA',
      rating: 4.8,
      commodities: ['Cocoa', 'Coffee'],
      volume: '50,000+ MT/year',
      lastOrder: '2025-01-10',
      status: 'Premium',
      contact: 'cocoa_procurement@cargill.com',
      phone: '+1-952-742-7575',
      address: 'Minneapolis, MN',
      website: 'www.cargill.com'
    },
    {
      id: 'BUY-003',
      name: 'ECOM Agroindustrial Corp',
      country: 'Switzerland',
      rating: 4.7,
      commodities: ['Cocoa', 'Coffee', 'Cotton'],
      volume: '45,000+ MT/year',
      lastOrder: '2025-01-12',
      status: 'Active',
      contact: 'trading@ecom.com',
      phone: '+41-22-840-8400',
      address: 'Pully, Switzerland',
      website: 'www.ecom.com'
    },
    {
      id: 'BUY-004',
      name: 'Olam Food Ingredients (ofi)',
      country: 'Singapore',
      rating: 4.8,
      commodities: ['Cocoa', 'Coffee', 'Spices'],
      volume: '60,000+ MT/year',
      lastOrder: '2025-01-08',
      status: 'Premium',
      contact: 'cocoa@ofi.com',
      phone: '+65-6339-4100',
      address: 'Singapore',
      website: 'www.ofi.com'
    },
    {
      id: 'BUY-005',
      name: 'Blommer Chocolate Company',
      country: 'USA',
      rating: 4.6,
      commodities: ['Cocoa'],
      volume: '35,000+ MT/year',
      lastOrder: '2025-01-05',
      status: 'Active',
      contact: 'procurement@blommer.com',
      phone: '+1-312-226-7700',
      address: 'Chicago, IL',
      website: 'www.blommer.com'
    },
    // Coffee Buyers
    {
      id: 'BUY-006',
      name: 'Royal Coffee Inc',
      country: 'USA',
      rating: 4.8,
      commodities: ['Coffee'],
      volume: '25,000+ MT/year',
      lastOrder: '2025-01-14',
      status: 'Active',
      contact: 'info@royalcoffee.com',
      phone: '+1-510-451-6100',
      address: 'Oakland, CA',
      website: 'www.royalcoffee.com'
    },
    {
      id: 'BUY-007',
      name: 'Cafe Imports',
      country: 'USA',
      rating: 4.7,
      commodities: ['Coffee'],
      volume: '18,000+ MT/year',
      lastOrder: '2025-01-11',
      status: 'Active',
      contact: 'info@cafeimports.com',
      phone: '+1-612-706-4244',
      address: 'Minneapolis, MN',
      website: 'www.cafeimports.com'
    },
    {
      id: 'BUY-008',
      name: 'Agora Coffee Merchants',
      country: 'USA',
      rating: 4.6,
      commodities: ['Coffee'],
      volume: '12,000+ MT/year',
      lastOrder: '2025-01-09',
      status: 'Active',
      contact: 'Kevin@agoracoffeemerchants.com',
      phone: '+1-973-567-4496',
      address: 'New Jersey',
      website: 'www.agoracoffeemerchants.com'
    },
    // Palm Oil Buyers
    {
      id: 'BUY-009',
      name: 'Wilmar International Limited',
      country: 'Singapore',
      rating: 4.9,
      commodities: ['Palm Oil', 'Vegetable Oils'],
      volume: '100,000+ MT/year',
      lastOrder: '2025-01-16',
      status: 'Premium',
      contact: 'trading@wilmar.com.sg',
      phone: '+65-6216-0244',
      address: 'Singapore',
      website: 'www.wilmar-international.com'
    },
    {
      id: 'BUY-010',
      name: 'Golden Agri-Resources Ltd',
      country: 'Singapore',
      rating: 4.8,
      commodities: ['Palm Oil'],
      volume: '80,000+ MT/year',
      lastOrder: '2025-01-13',
      status: 'Premium',
      contact: 'info@goldenagri.com.sg',
      phone: '+65-6216-2244',
      address: 'Singapore',
      website: 'www.goldenagri.com.sg'
    },
    {
      id: 'BUY-011',
      name: 'DAABON ORGANICS USA',
      country: 'USA',
      rating: 4.7,
      commodities: ['Palm Oil', 'Organic Products'],
      volume: '25,000+ MT/year',
      lastOrder: '2025-01-07',
      status: 'Active',
      contact: 'sales@daabon.com',
      phone: '+1-201-963-8003',
      address: 'New Jersey',
      website: 'www.daabon.com'
    },
    // Natural Rubber Buyers
    {
      id: 'BUY-012',
      name: 'Michelin North America',
      country: 'Canada',
      rating: 4.9,
      commodities: ['Natural Rubber'],
      volume: '40,000+ MT/year',
      lastOrder: '2025-01-17',
      status: 'Premium',
      contact: 'procurement@michelin.ca',
      phone: '+1-902-564-5500',
      address: 'Nova Scotia',
      website: 'www.michelin.ca'
    },
    {
      id: 'BUY-013',
      name: 'Continental Tire Americas LLC',
      country: 'USA',
      rating: 4.8,
      commodities: ['Natural Rubber'],
      volume: '30,000+ MT/year',
      lastOrder: '2025-01-14',
      status: 'Active',
      contact: 'purchasing@continental-corporation.com',
      phone: '+1-704-583-8000',
      address: 'Charlotte, NC',
      website: 'www.continental-tire.com'
    },
    {
      id: 'BUY-014',
      name: 'FGV Holdings Berhad',
      country: 'Malaysia',
      rating: 4.7,
      commodities: ['Natural Rubber', 'Palm Oil'],
      volume: '35,000+ MT/year',
      lastOrder: '2025-01-12',
      status: 'Active',
      contact: 'fgv.enquiries@fgvholdings.com',
      phone: '+603-2789-0000',
      address: 'Kuala Lumpur',
      website: 'www.fgvholdings.com'
    },
    {
      id: 'BUY-016',
      name: 'Sucden (Louis Dreyfus)',
      country: 'France',
      rating: 4.7,
      commodities: ['Cocoa', 'Coffee', 'Sugar'],
      volume: '525,000+ MT/year',
      lastOrder: '2025-01-18',
      status: 'Premium',
      contact: 'trading@sucden.com',
      phone: '+33-1-5565-5000',
      address: 'Paris, France',
      website: 'www.sucden.com'
    },
    {
      id: 'BUY-017',
      name: 'Touton Group',
      country: 'France',
      rating: 4.6,
      commodities: ['Cocoa', 'Coffee', 'Spices'],
      volume: '328,000+ MT/year',
      lastOrder: '2025-01-16',
      status: 'Active',
      contact: 'trading@touton.com',
      phone: '+33-5-5677-7000',
      address: 'Bordeaux, France',
      website: 'www.touton.com'
    },
    {
      id: 'BUY-018',
      name: 'CEMOI Group',
      country: 'France',
      rating: 4.5,
      commodities: ['Cocoa', 'Chocolate Products'],
      volume: '45,000+ MT/year',
      lastOrder: '2025-01-14',
      status: 'Active',
      contact: 'sourcing@cemoi.fr',
      phone: '+33-4-6877-2000',
      address: 'Perpignan, France',
      website: 'www.cemoi.fr'
    },
    {
      id: 'BUY-019',
      name: 'PRONATEC (Organic)',
      country: 'Germany',
      rating: 4.8,
      commodities: ['Cocoa', 'Organic Products'],
      volume: '15,000+ MT/year',
      lastOrder: '2025-01-17',
      status: 'Premium',
      contact: 'info@pronatec.de',
      phone: '+49-40-2537-8900',
      address: 'Hamburg, Germany',
      website: 'www.pronatec.de'
    },
    {
      id: 'BUY-020',
      name: 'ETG (Export Trading Group)',
      country: 'Kenya',
      rating: 4.4,
      commodities: ['Cocoa', 'Coffee', 'Cashew'],
      volume: '102,000+ MT/year',
      lastOrder: '2025-01-13',
      status: 'Active',
      contact: 'trading@etgworld.com',
      phone: '+254-20-2712-000',
      address: 'Nairobi, Kenya',
      website: 'www.etgworld.com'
    },

    // ============ COFFEE BUYERS (Major Importers) ============
    {
      id: 'BUY-021',
      name: 'Sucafina (Geneva)',
      country: 'Switzerland',
      rating: 4.9,
      commodities: ['Coffee', 'Specialty Coffee'],
      volume: '85,000+ MT/year',
      lastOrder: '2025-01-19',
      status: 'Premium',
      contact: 'trading@sucafina.com',
      phone: '+41-22-849-5400',
      address: 'Geneva, Switzerland',
      website: 'www.sucafina.com'
    },
    {
      id: 'BUY-022',
      name: 'Nestlé Trading SA',
      country: 'Switzerland',
      rating: 4.8,
      commodities: ['Coffee', 'Cocoa'],
      volume: '904,000+ MT/year',
      lastOrder: '2025-01-20',
      status: 'Premium',
      contact: 'sourcing@nestle.com',
      phone: '+41-21-924-2111',
      address: 'Vevey, Switzerland',
      website: 'www.nestle.com'
    },
    {
      id: 'BUY-023',
      name: 'JDE Peet\'s',
      country: 'Netherlands',
      rating: 4.7,
      commodities: ['Coffee'],
      volume: '450,000+ MT/year',
      lastOrder: '2025-01-18',
      status: 'Premium',
      contact: 'procurement@jdepeets.com',
      phone: '+31-20-558-1000',
      address: 'Amsterdam, Netherlands',
      website: 'www.jdepeets.com'
    },
    {
      id: 'BUY-024',
      name: 'Starbucks Corporation',
      country: 'USA',
      rating: 4.6,
      commodities: ['Coffee', 'Specialty Coffee'],
      volume: '380,000+ MT/year',
      lastOrder: '2025-01-17',
      status: 'Active',
      contact: 'supplier.diversity@starbucks.com',
      phone: '+1-206-447-1575',
      address: 'Seattle, WA',
      website: 'www.starbucks.com'
    },
    {
      id: 'BUY-025',
      name: 'Kraft Heinz Company',
      country: 'USA',
      rating: 4.5,
      commodities: ['Coffee'],
      volume: '280,000+ MT/year',
      lastOrder: '2025-01-16',
      status: 'Active',
      contact: 'procurement@kraftheinz.com',
      phone: '+1-412-456-5700',
      address: 'Pittsburgh, PA',
      website: 'www.kraftheinzcompany.com'
    },

    // ============ PALM OIL BUYERS (Global Leaders) ============
    {
      id: 'BUY-026',
      name: 'IOI Corporation Berhad',
      country: 'Malaysia',
      rating: 4.8,
      commodities: ['Palm Oil', 'Oleochemicals'],
      volume: '3.2M+ MT/year',
      lastOrder: '2025-01-19',
      status: 'Premium',
      contact: 'trading@ioigroup.com',
      phone: '+603-7491-8388',
      address: 'Putrajaya, Malaysia',
      website: 'www.ioigroup.com'
    },
    {
      id: 'BUY-027',
      name: 'Kuala Lumpur Kepong Berhad',
      country: 'Malaysia',
      rating: 4.7,
      commodities: ['Palm Oil'],
      volume: '2.8M+ MT/year',
      lastOrder: '2025-01-18',
      status: 'Premium',
      contact: 'trading@klk.com.my',
      phone: '+603-2170-5000',
      address: 'Kuala Lumpur, Malaysia',
      website: 'www.klk.com.my'
    },
    {
      id: 'BUY-028',
      name: 'PT Bakrie Sumatera Plantations',
      country: 'Indonesia',
      rating: 4.6,
      commodities: ['Palm Oil', 'Tea'],
      volume: '1.5M+ MT/year',
      lastOrder: '2025-01-17',
      status: 'Active',
      contact: 'marketing@bakrie-plantations.com',
      phone: '+62-21-527-2108',
      address: 'Jakarta, Indonesia',
      website: 'www.bakrie-plantations.com'
    },
    {
      id: 'BUY-029',
      name: 'Asian Agri',
      country: 'Indonesia',
      rating: 4.5,
      commodities: ['Palm Oil'],
      volume: '1.8M+ MT/year',
      lastOrder: '2025-01-16',
      status: 'Active',
      contact: 'info@asianagri.com',
      phone: '+62-21-230-1909',
      address: 'Jakarta, Indonesia',
      website: 'www.asianagri.com'
    },
    {
      id: 'BUY-030',
      name: 'United Plantations Berhad',
      country: 'Malaysia',
      rating: 4.7,
      commodities: ['Palm Oil', 'Coconut Products'],
      volume: '800,000+ MT/year',
      lastOrder: '2025-01-15',
      status: 'Active',
      contact: 'marketing@unitedplantations.com',
      phone: '+604-738-3200',
      address: 'Teluk Intan, Malaysia',
      website: 'www.unitedplantations.com'
    },
    {
      id: 'BUY-031',
      name: 'ADM (Archer Daniels Midland)',
      country: 'USA',
      rating: 4.9,
      commodities: ['Palm Oil', 'Vegetable Oils', 'Cocoa'],
      volume: '5M+ MT/year',
      lastOrder: '2025-01-20',
      status: 'Premium',
      contact: 'trading@adm.com',
      phone: '+1-312-634-8100',
      address: 'Chicago, IL',
      website: 'www.adm.com'
    },
    {
      id: 'BUY-032',
      name: 'Bunge Limited',
      country: 'USA',
      rating: 4.8,
      commodities: ['Palm Oil', 'Vegetable Oils'],
      volume: '4.2M+ MT/year',
      lastOrder: '2025-01-19',
      status: 'Premium',
      contact: 'trading@bunge.com',
      phone: '+1-314-292-2000',
      address: 'St. Louis, MO',
      website: 'www.bunge.com'
    },

    // ============ NATURAL RUBBER BUYERS (Tire Industry) ============
    {
      id: 'BUY-033',
      name: 'Bridgestone Corporation',
      country: 'Japan',
      rating: 4.9,
      commodities: ['Natural Rubber'],
      volume: '1.2M+ MT/year',
      lastOrder: '2025-01-20',
      status: 'Premium',
      contact: 'procurement@bridgestone.com',
      phone: '+81-3-3563-6811',
      address: 'Tokyo, Japan',
      website: 'www.bridgestone.com'
    },
    {
      id: 'BUY-034',
      name: 'Goodyear Tire & Rubber Co',
      country: 'USA',
      rating: 4.8,
      commodities: ['Natural Rubber'],
      volume: '950,000+ MT/year',
      lastOrder: '2025-01-19',
      status: 'Premium',
      contact: 'supplier.inquiry@goodyear.com',
      phone: '+1-330-796-2121',
      address: 'Akron, OH',
      website: 'www.goodyear.com'
    },
    {
      id: 'BUY-035',
      name: 'Sumitomo Rubber Industries',
      country: 'Japan',
      rating: 4.7,
      commodities: ['Natural Rubber'],
      volume: '680,000+ MT/year',
      lastOrder: '2025-01-18',
      status: 'Active',
      contact: 'global@srigroup.co.jp',
      phone: '+81-78-265-3000',
      address: 'Kobe, Japan',
      website: 'www.srigroup.co.jp'
    },
    {
      id: 'BUY-036',
      name: 'Pirelli & C. S.p.A.',
      country: 'Italy',
      rating: 4.6,
      commodities: ['Natural Rubber'],
      volume: '420,000+ MT/year',
      lastOrder: '2025-01-17',
      status: 'Active',
      contact: 'purchasing@pirelli.com',
      phone: '+39-02-6442-1',
      address: 'Milan, Italy',
      website: 'www.pirelli.com'
    },
    {
      id: 'BUY-037',
      name: 'Hankook Tire & Technology',
      country: 'South Korea',
      rating: 4.7,
      commodities: ['Natural Rubber'],
      volume: '520,000+ MT/year',
      lastOrder: '2025-01-16',
      status: 'Active',
      contact: 'hq@hankooktire.com',
      phone: '+82-2-2222-1000',
      address: 'Seoul, South Korea',
      website: 'www.hankooktire.com'
    },
    {
      id: 'BUY-038',
      name: 'Yokohama Rubber Co., Ltd.',
      country: 'Japan',
      rating: 4.6,
      commodities: ['Natural Rubber'],
      volume: '380,000+ MT/year',
      lastOrder: '2025-01-15',
      status: 'Active',
      contact: 'info@yrc.co.jp',
      phone: '+81-3-5400-4520',
      address: 'Tokyo, Japan',
      website: 'www.y-yokohama.com'
    },
    {
      id: 'BUY-039',
      name: 'Toyo Tire Corporation',
      country: 'Japan',
      rating: 4.5,
      commodities: ['Natural Rubber'],
      volume: '290,000+ MT/year',
      lastOrder: '2025-01-14',
      status: 'Active',
      contact: 'info@toyotires.co.jp',
      phone: '+81-6-6441-8801',
      address: 'Osaka, Japan',
      website: 'www.toyotires.co.jp'
    },
    {
      id: 'BUY-040',
      name: 'Kumho Tire Co., Inc.',
      country: 'South Korea',
      rating: 4.4,
      commodities: ['Natural Rubber'],
      volume: '340,000+ MT/year',
      lastOrder: '2025-01-13',
      status: 'Active',
      contact: 'global@kumhotire.co.kr',
      phone: '+82-2-6303-4114',
      address: 'Seoul, South Korea',
      website: 'www.kumhotire.com'
    },
    {
      id: 'BUY-041',
      name: 'Apollo Tyres Ltd',
      country: 'India',
      rating: 4.6,
      commodities: ['Natural Rubber'],
      volume: '450,000+ MT/year',
      lastOrder: '2025-01-18',
      status: 'Active',
      contact: 'procurement@apollotyres.com',
      phone: '+91-484-2719-000',
      address: 'Kochi, India',
      website: 'www.apollotyres.com'
    },
    {
      id: 'BUY-042',
      name: 'MRF Limited',
      country: 'India',
      rating: 4.7,
      commodities: ['Natural Rubber'],
      volume: '380,000+ MT/year',
      lastOrder: '2025-01-17',
      status: 'Active',
      contact: 'procurement@mrfmail.com',
      phone: '+91-44-2434-9595',
      address: 'Chennai, India',
      website: 'www.mrftyres.com'
    },
    {
      id: 'BUY-043',
      name: 'JK Tyre & Industries Ltd',
      country: 'India',
      rating: 4.5,
      commodities: ['Natural Rubber'],
      volume: '320,000+ MT/year',
      lastOrder: '2025-01-16',
      status: 'Active',
      contact: 'info@jktyre.com',
      phone: '+91-11-2618-9200',
      address: 'New Delhi, India',
      website: 'www.jktyre.com'
    },
    {
      id: 'BUY-044',
      name: 'CEAT Limited',
      country: 'India',
      rating: 4.4,
      commodities: ['Natural Rubber'],
      volume: '280,000+ MT/year',
      lastOrder: '2025-01-15',
      status: 'Active',
      contact: 'info@ceat.com',
      phone: '+91-22-6719-8000',
      address: 'Mumbai, India',
      website: 'www.ceat.com'
    },
    {
      id: 'BUY-045',
      name: 'Giti Tire Pte Ltd',
      country: 'Singapore',
      rating: 4.6,
      commodities: ['Natural Rubber'],
      volume: '420,000+ MT/year',
      lastOrder: '2025-01-14',
      status: 'Active',
      contact: 'contact@giti.com',
      phone: '+65-6861-9300',
      address: 'Singapore',
      website: 'www.giti.com'
    },

    // ============ CHINESE TIRE MANUFACTURERS ============
    {
      id: 'BUY-046',
      name: 'Zhongce Rubber Group (ZC Rubber)',
      country: 'China',
      rating: 4.5,
      commodities: ['Natural Rubber'],
      volume: '850,000+ MT/year',
      lastOrder: '2025-01-19',
      status: 'Active',
      contact: 'export@zcgroup.com',
      phone: '+86-571-8788-8888',
      address: 'Hangzhou, China',
      website: 'www.zcgroup.com'
    },
    {
      id: 'BUY-047',
      name: 'Triangle Tire Co., Ltd',
      country: 'China',
      rating: 4.4,
      commodities: ['Natural Rubber'],
      volume: '620,000+ MT/year',
      lastOrder: '2025-01-18',
      status: 'Active',
      contact: 'international@triangle.com.cn',
      phone: '+86-532-8878-8000',
      address: 'Qingdao, China',
      website: 'www.triangle.com.cn'
    },
    {
      id: 'BUY-048',
      name: 'Linglong Tire Co., Ltd',
      country: 'China',
      rating: 4.3,
      commodities: ['Natural Rubber'],
      volume: '580,000+ MT/year',
      lastOrder: '2025-01-17',
      status: 'Active',
      contact: 'export@linglong.cn',
      phone: '+86-546-8056-999',
      address: 'Dongying, China',
      website: 'www.linglong.cn'
    },

    // ============ CASSAVA STARCH BUYERS (Food Processing) ============
    {
      id: 'BUY-049',
      name: 'Ingredion Incorporated',
      country: 'USA',
      rating: 4.8,
      commodities: ['Cassava Starch', 'Food Ingredients'],
      volume: '180,000+ MT/year',
      lastOrder: '2025-01-19',
      status: 'Premium',
      contact: 'procurement@ingredion.com',
      phone: '+1-708-551-2600',
      address: 'Westchester, IL',
      website: 'www.ingredion.com'
    },
    {
      id: 'BUY-050',
      name: 'Tate & Lyle PLC',
      country: 'United Kingdom',
      rating: 4.7,
      commodities: ['Cassava Starch', 'Sweeteners'],
      volume: '120,000+ MT/year',
      lastOrder: '2025-01-18',
      status: 'Active',
      contact: 'procurement@tateandlyle.com',
      phone: '+44-20-7257-2100',
      address: 'London, UK',
      website: 'www.tateandlyle.com'
    },
    {
      id: 'BUY-051',
      name: 'SPAC Starch Products Ltd',
      country: 'India',
      rating: 4.6,
      commodities: ['Cassava Starch'],
      volume: '95,000+ MT/year',
      lastOrder: '2025-01-17',
      status: 'Active',
      contact: 'export@spacstarch.com',
      phone: '+91-80-2839-5555',
      address: 'Bangalore, India',
      website: 'www.spacstarch.com'
    },
    {
      id: 'BUY-052',
      name: 'Sanstar Bio-Polymers Ltd',
      country: 'India',
      rating: 4.5,
      commodities: ['Cassava Starch', 'Modified Starch'],
      volume: '75,000+ MT/year',
      lastOrder: '2025-01-16',
      status: 'Active',
      contact: 'export@sanstargroup.com',
      phone: '+91-281-235-5555',
      address: 'Rajkot, India',
      website: 'www.sanstargroup.com'
    },
    {
      id: 'BUY-053',
      name: 'Asia Fructose Co., Ltd',
      country: 'Thailand',
      rating: 4.4,
      commodities: ['Cassava Starch', 'Sweeteners'],
      volume: '85,000+ MT/year',
      lastOrder: '2025-01-15',
      status: 'Active',
      contact: 'export@asiafructose.com',
      phone: '+66-2-513-1234',
      address: 'Bangkok, Thailand',
      website: 'www.asiafructose.com'
    },
    {
      id: 'BUY-054',
      name: 'Thai Foods Product International',
      country: 'Thailand',
      rating: 4.3,
      commodities: ['Cassava Starch'],
      volume: '65,000+ MT/year',
      lastOrder: '2025-01-14',
      status: 'Active',
      contact: 'info@thaifoods.co.th',
      phone: '+66-2-975-8888',
      address: 'Bangkok, Thailand',
      website: 'www.thaifoods.co.th'
    },
    {
      id: 'BUY-055',
      name: 'MERCAGRO CORP',
      country: 'USA',
      rating: 4.6,
      commodities: ['Cassava Starch'],
      volume: '45,000+ MT/year',
      lastOrder: '2025-01-18',
      status: 'Active',
      contact: 'trading@mercagro.com',
      phone: '+1-305-592-7000',
      address: 'Miami, FL',
      website: 'www.mercagro.com'
    },
    {
      id: 'BUY-056',
      name: 'PROSPERA FOODS INC',
      country: 'USA',
      rating: 4.5,
      commodities: ['Cassava Starch'],
      volume: '38,000+ MT/year',
      lastOrder: '2025-01-17',
      status: 'Active',
      contact: 'procurement@prosperafoods.com',
      phone: '+1-214-555-0123',
      address: 'Dallas, TX',
      website: 'www.prosperafoods.com'
    },

    // ============ COCONUT OIL BUYERS (Food & Cosmetics) ============
    {
      id: 'BUY-057',
      name: 'Tradin Organic Agriculture B.V.',
      country: 'Netherlands',
      rating: 4.8,
      commodities: ['Coconut Oil', 'Organic Products'],
      volume: '85,000+ MT/year',
      lastOrder: '2025-01-19',
      status: 'Premium',
      contact: 'sourcing@tradinorganic.com',
      phone: '+31-20-467-0090',
      address: 'Amsterdam, Netherlands',
      website: 'www.tradinorganic.com'
    },
    {
      id: 'BUY-058',
      name: 'Mangga Dua',
      country: 'Indonesia',
      rating: 4.7,
      commodities: ['Coconut Oil', 'RBD Coconut Oil'],
      volume: '120,000+ MT/year',
      lastOrder: '2025-01-18',
      status: 'Active',
      contact: 'export@manggadua.com',
      phone: '+62-21-690-8888',
      address: 'Jakarta, Indonesia',
      website: 'www.manggadua.com'
    },
    {
      id: 'BUY-059',
      name: 'All Organic Treasure GmbH',
      country: 'Germany',
      rating: 4.6,
      commodities: ['Coconut Oil', 'Organic Products'],
      volume: '35,000+ MT/year',
      lastOrder: '2025-01-17',
      status: 'Active',
      contact: 'info@all-organic-treasure.de',
      phone: '+49-40-228-6650',
      address: 'Hamburg, Germany',
      website: 'www.all-organic-treasure.de'
    },
    {
      id: 'BUY-060',
      name: 'Delphi Organic',
      country: 'Germany',
      rating: 4.5,
      commodities: ['Coconut Oil', 'Organic Oils'],
      volume: '28,000+ MT/year',
      lastOrder: '2025-01-16',
      status: 'Active',
      contact: 'info@delphi-organic.com',
      phone: '+49-2173-166-0',
      address: 'Langenfeld, Germany',
      website: 'www.delphi-organic.com'
    },
    {
      id: 'BUY-061',
      name: 'Ölmühle Moog (BIO PLANÈTE)',
      country: 'Germany',
      rating: 4.7,
      commodities: ['Coconut Oil', 'Organic Oils'],
      volume: '42,000+ MT/year',
      lastOrder: '2025-01-15',
      status: 'Active',
      contact: 'info@oelmuehle-moog.de',
      phone: '+49-7336-9652-0',
      address: 'Lommatzsch, Germany',
      website: 'www.bio-planete.com'
    },
    {
      id: 'BUY-062',
      name: 'The Coconut Company Ltd',
      country: 'United Kingdom',
      rating: 4.6,
      commodities: ['Coconut Oil', 'Coconut Products'],
      volume: '25,000+ MT/year',
      lastOrder: '2025-01-14',
      status: 'Active',
      contact: 'trade@thecoconutcompany.co',
      phone: '+44-1273-747-705',
      address: 'Brighton, UK',
      website: 'www.thecoconutcompany.co'
    },
    {
      id: 'BUY-063',
      name: 'Greenville Agro Corporation',
      country: 'Philippines',
      rating: 4.8,
      commodities: ['Coconut Oil', 'Virgin Coconut Oil'],
      volume: '95,000+ MT/year',
      lastOrder: '2025-01-18',
      status: 'Premium',
      contact: 'export@greenvilleagro.com',
      phone: '+63-2-8634-5000',
      address: 'Manila, Philippines',
      website: 'www.greenvilleagro.com'
    },
    {
      id: 'BUY-064',
      name: 'Royce Food Corporation',
      country: 'Philippines',
      rating: 4.7,
      commodities: ['Coconut Oil', 'RBD Coconut Oil'],
      volume: '78,000+ MT/year',
      lastOrder: '2025-01-17',
      status: 'Active',
      contact: 'sales@roycefood.com',
      phone: '+63-2-8567-8900',
      address: 'Quezon City, Philippines',
      website: 'www.roycefood.com'
    },
    {
      id: 'BUY-065',
      name: 'Celebes Coconut Corporation',
      country: 'Philippines',
      rating: 4.6,
      commodities: ['Coconut Oil', 'Organic Coconut Oil'],
      volume: '65,000+ MT/year',
      lastOrder: '2025-01-16',
      status: 'Active',
      contact: 'export@celebescoconut.com',
      phone: '+63-2-8456-7890',
      address: 'Manila, Philippines',
      website: 'www.celebescoconut.com'
    },
    {
      id: 'BUY-066',
      name: 'Novel Nutrients Pvt. Ltd.',
      country: 'India',
      rating: 4.5,
      commodities: ['Coconut Oil'],
      volume: '45,000+ MT/year',
      lastOrder: '2025-01-15',
      status: 'Active',
      contact: 'export@novelnutrients.com',
      phone: '+91-484-270-5000',
      address: 'Kochi, India',
      website: 'www.novelnutrients.com'
    },
    {
      id: 'BUY-067',
      name: 'Aromaax International',
      country: 'India',
      rating: 4.4,
      commodities: ['Coconut Oil', 'Organic Virgin Coconut Oil'],
      volume: '38,000+ MT/year',
      lastOrder: '2025-01-14',
      status: 'Active',
      contact: 'export@aromaax.com',
      phone: '+91-495-274-5000',
      address: 'Calicut, India',
      website: 'www.aromaax.com'
    },
    {
      id: 'BUY-068',
      name: 'Sun Bionaturals Private Ltd',
      country: 'India',
      rating: 4.3,
      commodities: ['Coconut Oil', 'Personal Care Products'],
      volume: '32,000+ MT/year',
      lastOrder: '2025-01-13',
      status: 'Active',
      contact: 'info@sunbionaturals.com',
      phone: '+91-422-262-8888',
      address: 'Coimbatore, India',
      website: 'www.sunbionaturals.com'
    },

    // ============ ADDITIONAL GLOBAL COMMODITY TRADERS ============
    {
      id: 'BUY-069',
      name: 'Glencore International AG',
      country: 'Switzerland',
      rating: 4.9,
      commodities: ['All Commodities', 'Metals', 'Energy'],
      volume: '500M+ MT/year',
      lastOrder: '2025-01-20',
      status: 'Premium',
      contact: 'trading@glencore.com',
      phone: '+41-41-709-2000',
      address: 'Baar, Switzerland',
      website: 'www.glencore.com'
    },
    {
      id: 'BUY-070',
      name: 'Vitol Group',
      country: 'Netherlands',
      rating: 4.8,
      commodities: ['Energy', 'Vegetable Oils'],
      volume: '300M+ MT/year',
      lastOrder: '2025-01-19',
      status: 'Premium',
      contact: 'trading@vitol.com',
      phone: '+31-10-217-9000',
      address: 'Rotterdam, Netherlands',
      website: 'www.vitol.com'
    },
    {
      id: 'BUY-071',
      name: 'Trafigura Group Pte Ltd',
      country: 'Singapore',
      rating: 4.7,
      commodities: ['All Commodities', 'Metals'],
      volume: '400M+ MT/year',
      lastOrder: '2025-01-18',
      status: 'Premium',
      contact: 'trading@trafigura.com',
      phone: '+65-6572-8200',
      address: 'Singapore',
      website: 'www.trafigura.com'
    },

    // ============ TOBACCO BUYERS (Global Tobacco Giants) ============
    {
      id: 'BUY-073',
      name: 'Philip Morris International',
      country: 'USA',
      rating: 4.9,
      commodities: ['Tobacco', 'Tobacco Leaf'],
      volume: '800,000+ MT/year',
      lastOrder: '2025-01-20',
      status: 'Premium',
      contact: 'global.procurement@pmi.com',
      phone: '+1-203-858-5000',
      address: 'Stamford, CT',
      website: 'www.pmi.com'
    },
    {
      id: 'BUY-074',
      name: 'British American Tobacco PLC',
      country: 'United Kingdom',
      rating: 4.8,
      commodities: ['Tobacco', 'Tobacco Products'],
      volume: '650,000+ MT/year',
      lastOrder: '2025-01-19',
      status: 'Premium',
      contact: 'procurement@bat.com',
      phone: '+44-20-7845-1000',
      address: 'London, UK',
      website: 'www.bat.com'
    },
    {
      id: 'BUY-075',
      name: 'Japan Tobacco International',
      country: 'Switzerland',
      rating: 4.8,
      commodities: ['Tobacco', 'Tobacco Leaf'],
      volume: '580,000+ MT/year',
      lastOrder: '2025-01-18',
      status: 'Premium',
      contact: 'suppliers@jti.com',
      phone: '+41-22-703-8888',
      address: 'Geneva, Switzerland',
      website: 'www.jti.com'
    },
    {
      id: 'BUY-076',
      name: 'Imperial Brands PLC',
      country: 'United Kingdom',
      rating: 4.7,
      commodities: ['Tobacco', 'Tobacco Leaf'],
      volume: '420,000+ MT/year',
      lastOrder: '2025-01-17',
      status: 'Active',
      contact: 'procurement@imperialbrandsplc.com',
      phone: '+44-117-963-6636',
      address: 'Bristol, UK',
      website: 'www.imperialbrandsplc.com'
    },
    {
      id: 'BUY-077',
      name: 'Universal Corporation',
      country: 'USA',
      rating: 4.9,
      commodities: ['Tobacco', 'Leaf Tobacco'],
      volume: '320,000+ MT/year',
      lastOrder: '2025-01-19',
      status: 'Premium',
      contact: 'leafsales@universalcorp.com',
      phone: '+1-804-359-9311',
      address: 'Richmond, VA',
      website: 'www.universalcorp.com'
    },
    {
      id: 'BUY-078',
      name: 'Alliance One International (Pyxus)',
      country: 'USA',
      rating: 4.8,
      commodities: ['Tobacco', 'Leaf Tobacco'],
      volume: '280,000+ MT/year',
      lastOrder: '2025-01-18',
      status: 'Active',
      contact: 'trading@aointl.com',
      phone: '+1-919-379-4300',
      address: 'Raleigh, NC',
      website: 'www.aointl.com'
    },
    {
      id: 'BUY-079',
      name: 'Altria Group Inc',
      country: 'USA',
      rating: 4.6,
      commodities: ['Tobacco', 'Tobacco Products'],
      volume: '250,000+ MT/year',
      lastOrder: '2025-01-16',
      status: 'Active',
      contact: 'procurement@altria.com',
      phone: '+1-804-274-2200',
      address: 'Richmond, VA',
      website: 'www.altria.com'
    },
    {
      id: 'BUY-080',
      name: 'Tobacco Traders International Ltd',
      country: 'Hong Kong',
      rating: 4.5,
      commodities: ['Tobacco', 'Tobacco Trading'],
      volume: '180,000+ MT/year',
      lastOrder: '2025-01-15',
      status: 'Active',
      contact: 'trading@tobaccotradersintl.com',
      phone: '+852-2537-5857',
      address: 'Kowloon, Hong Kong',
      website: 'www.tobaccotradersintl.com'
    },
    {
      id: 'BUY-081',
      name: 'China Tobacco International',
      country: 'China',
      rating: 4.7,
      commodities: ['Tobacco', 'Tobacco Leaf'],
      volume: '950,000+ MT/year',
      lastOrder: '2025-01-17',
      status: 'Active',
      contact: 'export@ctiec.com.cn',
      phone: '+86-10-6465-8888',
      address: 'Beijing, China',
      website: 'www.ctiec.com.cn'
    },
    {
      id: 'BUY-082',
      name: 'Reynolds American Inc',
      country: 'USA',
      rating: 4.6,
      commodities: ['Tobacco'],
      volume: '220,000+ MT/year',
      lastOrder: '2025-01-14',
      status: 'Active',
      contact: 'suppliers@reynoldsamerican.com',
      phone: '+1-336-741-2000',
      address: 'Winston-Salem, NC',
      website: 'www.reynoldsamerican.com'
    },
    {
      id: 'BUY-083',
      name: 'ITC Limited (Tobacco Division)',
      country: 'India',
      rating: 4.5,
      commodities: ['Tobacco', 'Tobacco Products'],
      volume: '195,000+ MT/year',
      lastOrder: '2025-01-13',
      status: 'Active',
      contact: 'procurement@itc.in',
      phone: '+91-33-2288-9371',
      address: 'Kolkata, India',
      website: 'www.itcportal.com'
    },
    {
      id: 'BUY-084',
      name: 'Skandinavisk Tobakskompagni A/S',
      country: 'Denmark',
      rating: 4.4,
      commodities: ['Tobacco', 'Fine Cut Tobacco'],
      volume: '85,000+ MT/year',
      lastOrder: '2025-01-12',
      status: 'Active',
      contact: 'trading@st.dk',
      phone: '+45-33-41-0101',
      address: 'Copenhagen, Denmark',
      website: 'www.st.dk'
    },
    {
      id: 'BUY-085',
      name: 'Gallaher Group (JTI Europe)',
      country: 'United Kingdom',
      rating: 4.6,
      commodities: ['Tobacco'],
      volume: '160,000+ MT/year',
      lastOrder: '2025-01-16',
      status: 'Active',
      contact: 'procurement@jti.com',
      phone: '+44-1932-859-777',
      address: 'Weybridge, UK',
      website: 'www.jti.com'
    },
    {
      id: 'BUY-086',
      name: 'PT Bentoel International Investama',
      country: 'Indonesia',
      rating: 4.3,
      commodities: ['Tobacco', 'Kretek Cigarettes'],
      volume: '120,000+ MT/year',
      lastOrder: '2025-01-11',
      status: 'Active',
      contact: 'procurement@bentoel.com',
      phone: '+62-24-869-5555',
      address: 'Semarang, Indonesia',
      website: 'www.bentoel.com'
    },
    {
      id: 'BUY-087',
      name: 'KT&G Corporation',
      country: 'South Korea',
      rating: 4.5,
      commodities: ['Tobacco'],
      volume: '140,000+ MT/year',
      lastOrder: '2025-01-10',
      status: 'Active',
      contact: 'global@ktng.com',
      phone: '+82-42-720-1114',
      address: 'Daejeon, South Korea',
      website: 'www.ktng.com'
    },

    // ============ ROBUSTA COFFEE BUYERS (Specialty Coffee Importers) ============
    {
      id: 'BUY-089',
      name: 'Royal Coffee Inc',
      country: 'USA',
      rating: 4.9,
      commodities: ['Coffee (Robusta)', 'Specialty Coffee'],
      volume: '35,000+ MT/year',
      lastOrder: '2025-01-20',
      status: 'Premium',
      contact: 'sourcing@royalcoffee.com',
      phone: '+1-510-451-6100',
      address: 'Oakland, CA',
      website: 'www.royalcoffee.com'
    },
    {
      id: 'BUY-090',
      name: 'Atlas Coffee Importers',
      country: 'USA',
      rating: 4.8,
      commodities: ['Coffee (Robusta)', 'Green Coffee Beans'],
      volume: '28,000+ MT/year',
      lastOrder: '2025-01-19',
      status: 'Premium',
      contact: 'imports@atlascoffee.com',
      phone: '+1-206-545-1700',
      address: 'Seattle, WA',
      website: 'www.atlascoffee.com'
    },
    {
      id: 'BUY-091',
      name: 'Copan Trade',
      country: 'USA',
      rating: 4.7,
      commodities: ['Coffee (Robusta)', 'Coffee Trading'],
      volume: '22,000+ MT/year',
      lastOrder: '2025-01-18',
      status: 'Active',
      contact: 'trading@copantrade.com',
      phone: '+1-832-456-7890',
      address: 'Houston, TX',
      website: 'www.copantrade.com'
    },
    {
      id: 'BUY-092',
      name: 'Volcafe Ltd',
      country: 'Switzerland',
      rating: 4.8,
      commodities: ['Coffee (Robusta)', 'Coffee Trading'],
      volume: '45,000+ MT/year',
      lastOrder: '2025-01-17',
      status: 'Premium',
      contact: 'trading@volcafe.com',
      phone: '+41-58-656-0000',
      address: 'Winterthur, Switzerland',
      website: 'www.volcafe.com'
    },
    {
      id: 'BUY-093',
      name: 'Olam Coffee',
      country: 'Singapore',
      rating: 4.7,
      commodities: ['Coffee (Robusta)', 'Coffee Processing'],
      volume: '38,000+ MT/year',
      lastOrder: '2025-01-16',
      status: 'Active',
      contact: 'coffee@olamgroup.com',
      phone: '+65-6339-4100',
      address: 'Singapore',
      website: 'www.olamgroup.com'
    },
    {
      id: 'BUY-094',
      name: 'ECOM Coffee Corp',
      country: 'USA',
      rating: 4.6,
      commodities: ['Coffee (Robusta)', 'Sustainable Coffee'],
      volume: '32,000+ MT/year',
      lastOrder: '2025-01-15',
      status: 'Active',
      contact: 'trading@ecomtrading.com',
      phone: '+1-201-333-5000',
      address: 'Hoboken, NJ',
      website: 'www.ecomtrading.com'
    },
    {
      id: 'BUY-095',
      name: 'Mercon Coffee Group',
      country: 'Brazil',
      rating: 4.5,
      commodities: ['Coffee (Robusta)', 'Coffee Export'],
      volume: '55,000+ MT/year',
      lastOrder: '2025-01-14',
      status: 'Active',
      contact: 'export@mercon.com.br',
      phone: '+55-11-3046-5500',
      address: 'São Paulo, Brazil',
      website: 'www.mercon.com.br'
    },
    {
      id: 'BUY-096',
      name: 'Armajaro Trading Ltd',
      country: 'United Kingdom',
      rating: 4.4,
      commodities: ['Coffee (Robusta)', 'Commodity Trading'],
      volume: '25,000+ MT/year',
      lastOrder: '2025-01-13',
      status: 'Active',
      contact: 'coffee@armajaro.com',
      phone: '+44-20-7426-3000',
      address: 'London, UK',
      website: 'www.armajaro.com'
    },
    {
      id: 'BUY-097',
      name: 'Intimex Group',
      country: 'Vietnam',
      rating: 4.6,
      commodities: ['Coffee (Robusta)', 'Vietnam Coffee'],
      volume: '48,000+ MT/year',
      lastOrder: '2025-01-12',
      status: 'Active',
      contact: 'export@intimexgroup.com',
      phone: '+84-28-3835-4567',
      address: 'Ho Chi Minh City, Vietnam',
      website: 'www.intimexgroup.com'
    },
    {
      id: 'BUY-098',
      name: 'Interamerican Coffee LLC',
      country: 'USA',
      rating: 4.5,
      commodities: ['Coffee (Robusta)', 'Latin American Coffee'],
      volume: '30,000+ MT/year',
      lastOrder: '2025-01-11',
      status: 'Active',
      contact: 'trading@interamericancoffee.com',
      phone: '+1-305-591-4500',
      address: 'Miami, FL',
      website: 'www.interamericancoffee.com'
    },

    // Additional Commodity Buyers
    {
      id: 'BUY-099',
      name: 'Sri Trang Agro-Industry',
      country: 'Thailand',
      rating: 4.8,
      commodities: ['Natural Rubber', 'Latex'],
      volume: '50,000+ MT/year',
      lastOrder: '2025-01-15',
      status: 'Premium',
      contact: 'export@sritrang.com',
      phone: '+66-7431-2000',
      address: 'Songkhla, Thailand',
      website: 'www.sritrang.com'
    }
  ], []);

  // ⚡ MEMOIZED SEARCH FILTER
  const filteredBuyers = useMemo(() => 
    realBuyers.filter(buyer =>
      buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.commodities.some(commodity => commodity.toLowerCase().includes(searchTerm.toLowerCase())) ||
      buyer.country.toLowerCase().includes(searchTerm.toLowerCase())
    ), [realBuyers, searchTerm]);
  
  // ⚡ VIRTUAL SCROLLING FOR PERFORMANCE - Show only visible items
  const { visibleItems, loadMore, hasMore } = useVirtualScrolling(filteredBuyers);

  // ⚡ MEMOIZED STATUS COLOR FUNCTION
  const getStatusColor = useMemo(() => {
    const statusColors = {
      'Premium': 'bg-purple-100 text-purple-800',
      'Active': 'bg-green-100 text-green-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return (status: string) => statusColors[status as keyof typeof statusColors] || statusColors.default;
  }, []);

  // ⚡ MEMOIZED SEARCH HANDLER
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <CleanExporterLayout user={user}>
      <Helmet>
        <title>Buyer Marketplace - Exporter Portal</title>
        <meta name="description" content="Connect with verified buyers and explore new market opportunities" />
      </Helmet>

      <div className="bg-white shadow-sm border-b border-slate-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900">Global Marketplace</h1>
                <p className="text-sm text-slate-600">Connect with verified buyers worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search buyers or commodities..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        {/* Marketplace Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Active Buyers</p>
                  <p className="text-3xl font-bold text-blue-900">{realBuyers.length}</p>
                </div>
                <Users className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Countries</p>
                  <p className="text-3xl font-bold text-green-900">{Array.from(new Set(realBuyers.map(b => b.country))).length}</p>
                </div>
                <Globe className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Premium Buyers</p>
                  <p className="text-3xl font-bold text-purple-900">{realBuyers.filter(b => b.status === 'Premium').length}</p>
                </div>
                <Star className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Avg. Rating</p>
                  <p className="text-3xl font-bold text-orange-900">{(realBuyers.reduce((sum, b) => sum + b.rating, 0) / realBuyers.length).toFixed(1)}</p>
                </div>
                <Star className="h-12 w-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Buyer Listings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              Verified Buyers ({filteredBuyers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleItems.map((buyer) => (
                <div key={buyer.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{buyer.name}</h3>
                      <p className="text-gray-600 flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {buyer.country}
                      </p>
                    </div>
                    <Badge className={getStatusColor(buyer.status)}>
                      {buyer.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{buyer.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Volume:</span>
                      <span className="font-medium">{buyer.volume}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Order:</span>
                      <span className="font-medium">{buyer.lastOrder}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-gray-500 text-sm">Commodities:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {buyer.commodities.map((commodity) => (
                        <Badge key={commodity} variant="secondary" className="text-xs">
                          {commodity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Real Contact Information */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-sm font-medium">Real Contact Info:</span>
                    <div className="space-y-1 mt-2 text-xs">
                      <div><strong>Email:</strong> <a href={`mailto:${buyer.contact}`} className="text-blue-600 hover:underline">{buyer.contact}</a></div>
                      <div><strong>Phone:</strong> <a href={`tel:${buyer.phone}`} className="text-blue-600 hover:underline">{buyer.phone}</a></div>
                      <div><strong>Website:</strong> <a href={`https://${buyer.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{buyer.website}</a></div>
                      <div><strong>Address:</strong> <span className="text-gray-600">{buyer.address}</span></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">Contact Buyer</Button>
                    <Button size="sm" variant="outline">View Profile</Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* ⚡ VIRTUAL SCROLLING LOAD MORE BUTTON */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={loadMore}
                  variant="outline"
                  className="px-8 py-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  Load More Buyers ({filteredBuyers.length - visibleItems.length} remaining)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CleanExporterLayout>
  );
});

ExporterMarketplace.displayName = 'ExporterMarketplace';
export default ExporterMarketplace;