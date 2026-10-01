import { NextResponse } from 'next/server';
import { getDb, saveDb, CaregiverAlert } from '@/lib/db';
import { dispatchCaregiverAlert, CaregiverAlertPayload } from '@/lib/alerts';

export async function POST(req: Request) {
  try {
    const body: CaregiverAlertPayload = await req.json();

    const db = getDb();
    const user = db.users[0] || { name: 'Kamla Devi', emergencyPhone: '+91 98765 43210' };

    const payload: CaregiverAlertPayload = {
      alertType: body.alertType || 'TEST_ALERT',
      patientName: body.patientName || user.name,
      caregiverPhone: body.caregiverPhone || user.emergencyPhone,
      details: body.details || 'Automated caregiver notification check.',
      severity: body.severity || 'MEDIUM',
    };

    // 1. Dispatch through multi-channel provider
    const dispatchResults = await dispatchCaregiverAlert(payload);

    // 2. Persist alert to database
    const newAlert: CaregiverAlert = {
      id: `alert-${Date.now()}`,
      userId: user.id || 'user_kamla',
      type: payload.alertType === 'MISSED_MEDICINE' 
        ? 'MISSED_MEDICATION' 
        : payload.alertType === 'SOS_EMERGENCY'
        ? 'EMERGENCY_TRIGGER'
        : 'PERFORMANCE_DECLINE',
      message: payload.details,
      severity: payload.severity,
      date: new Date().toLocaleDateString(),
      isResolved: false,
    };

    db.caregiverAlerts.unshift(newAlert);
    saveDb(db);

    return NextResponse.json({
      success: true,
      alert: newAlert,
      dispatchResults,
      message: 'Caregiver multi-channel alert dispatched successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to dispatch caregiver alert', details: String(error) },
      { status: 500 }
    );
  }
}
