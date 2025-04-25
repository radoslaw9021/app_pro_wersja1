# Dodatkowe endpointy do dodania w main.py

# === CARE PLAN ENDPOINTS ===

@app.post("/care-plans/", response_model=schemas.CarePlan)
async def create_care_plan(
    care_plan: schemas.CarePlanCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_admin_user)
):
    # Sprawdź czy klient istnieje i czy kosmetolog ma do niego dostęp
    db_client = db.query(models.Client).filter(models.Client.id == care_plan.client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    if db_client.cosmetologist_id != current_user.id:
        raise HTTPException(status_code=403, detail="No permission for this client")
    
    # Sprawdź czy analiza istnieje i należy do klienta
    db_analysis = db.query(models.Analysis).filter(
        models.Analysis.id == care_plan.analysis_id,
        models.Analysis.client_id == care_plan.client_id
    ).first()
    if not db_analysis:
        raise HTTPException(status_code=404, detail="Analysis not found or doesn't belong to this client")
    
    # Utwórz nowy plan pielęgnacyjny
    db_care_plan = models.CarePlan(
        client_id=care_plan.client_id,
        analysis_id=care_plan.analysis_id,
        created_by=current_user.id,
        title=care_plan.title,
        description=care_plan.description,
        valid_until=care_plan.valid_until
    )
    
    db.add(db_care_plan)
    db.commit()
    db.refresh(db_care_plan)
    
    # Dodaj produkty do planu
    for i, item in enumerate(care_plan.items):
        # Sprawdź czy produkt istnieje
        db_product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not db_product:
            raise HTTPException(status_code=404, detail=f"Product with id {item.product_id} not found")
        
        # Dodaj element do planu
        db_item = models.CarePlanItem(
            care_plan_id=db_care_plan.id,
            product_id=item.product_id,
            usage_time=item.usage_time,
            usage_frequency=item.usage_frequency,
            usage_instructions=item.usage_instructions,
            order=item.order or i  # Jeśli order nie podany, użyj indeksu
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_care_plan)
    return db_care_plan

@app.get("/care-plans/", response_model=List[schemas.CarePlan])
async def read_care_plans(
    client_id: Optional[int] = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    query = db.query(models.CarePlan)
    
    if current_user.role == models.UserRole.ADMIN:
        # Dla kosmetologa - filtruj po klientach, których obsługuje
        if client_id:
            client = db.query(models.Client).filter(models.Client.id == client_id).first()
            if not client or client.cosmetologist_id != current_user.id:
                raise HTTPException(status_code=403, detail="No permission for this client")
            query = query.filter(models.CarePlan.client_id == client_id)
        else:
            # Jeśli nie podano client_id, pobierz wszystkich klientów kosmetologa
            clients = db.query(models.Client).filter(
                models.Client.cosmetologist_id == current_user.id
            ).all()
            client_ids = [client.id for client in clients]
            query = query.filter(models.CarePlan.client_id.in_(client_ids))
    else:
        # Dla klienta - pokaż tylko jego plany
        client = db.query(models.Client).filter(models.Client.user_id == current_user.id).first()
        if not client:
            raise HTTPException(status_code=404, detail="Client profile not found")
        query = query.filter(models.CarePlan.client_id == client.id)
    
    care_plans = query.order_by(models.CarePlan.created_at.desc()).offset(skip).limit(limit).all()
    return care_plans

@app.get("/care-plans/{care_plan_id}", response_model=schemas.CarePlanDetail)
async def read_care_plan(care_plan_id: int, db: Session = Depends(get_db),
                         current_user: schemas.User = Depends(get_current_active_user)):
    db_care_plan = db.query(models.CarePlan).filter(models.CarePlan.id == care_plan_id).first()
    if db_care_plan is None:
        raise HTTPException(status_code=404, detail="Care plan not found")
    
    # Sprawdź uprawnienia
    if current_user.role == models.UserRole.ADMIN:
        # Kosmetolog musi być przypisany do klienta
        client = db.query(models.Client).filter(models.Client.id == db_care_plan.client_id).first()
        if not client or client.cosmetologist_id != current_user.id:
            raise HTTPException(status_code=403, detail="No permission for this care plan")
    else:
        # Klient może zobaczyć tylko swoje plany
        client = db.query(models.Client).filter(models.Client.user_id == current_user.id).first()
        if not client or client.id != db_care_plan.client_id:
            raise HTTPException(status_code=403, detail="No permission for this care plan")
    
    return db_care_plan

@app.put("/care-plans/{care_plan_id}", response_model=schemas.CarePlan)
async def update_care_plan(
    care_plan_id: int, 
    care_plan_update: schemas.CarePlanCreate,  # Używamy tego samego schematu, bo chcemy móc aktualizować również produkty
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_admin_user)
):
    db_care_plan = db.query(models.CarePlan).filter(models.CarePlan.id == care_plan_id).first()
    if db_care_plan is None:
        raise HTTPException(status_code=404, detail="Care plan not found")
    
    # Sprawdź czy kosmetolog ma uprawnienia
    client = db.query(models.Client).filter(models.Client.id == db_care_plan.client_id).first()
    if not client or client.cosmetologist_id != current_user.id:
        raise HTTPException(status_code=403, detail="No permission for this care plan")
    
    # Zaktualizuj podstawowe dane
    db_care_plan.title = care_plan_update.title
    db_care_plan.description = care_plan_update.description
    db_care_plan.valid_until = care_plan_update.valid_until
    
    # Usuń obecne produkty z planu
    db.query(models.CarePlanItem).filter(models.CarePlanItem.care_plan_id == care_plan_id).delete()
    
    # Dodaj nowe produkty
    for i, item in enumerate(care_plan_update.items):
        db_product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not db_product:
            raise HTTPException(status_code=404, detail=f"Product with id {item.product_id} not found")
        
        db_item = models.CarePlanItem(
            care_plan_id=db_care_plan.id,
            product_id=item.product_id,
            usage_time=item.usage_time,
            usage_frequency=item.usage_frequency,
            usage_instructions=item.usage_instructions,
            order=item.order or i
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_care_plan)
    return db_care_plan

@app.delete("/care-plans/{care_plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_care_plan(
    care_plan_id: int, 
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_admin_user)
):
    db_care_plan = db.query(models.CarePlan).filter(models.CarePlan.id == care_plan_id).first()
    if db_care_plan is None:
        raise HTTPException(status_code=404, detail="Care plan not found")
    
    # Sprawdź czy kosmetolog ma uprawnienia do tego planu
    client = db.query(models.Client).filter(models.Client.id == db_care_plan.client_id).first()
    if not client or client.cosmetologist_id != current_user.id:
        raise HTTPException(status_code=403, detail="No permission for this care plan")
    
    # Usuń wszystkie elementy planu
    db.query(models.CarePlanItem).filter(models.CarePlanItem.care_plan_id == care_plan_id).delete()
    
    # Usuń plan
    db.delete(db_care_plan)
    db.commit()
    return {}

# === CHAT ENDPOINTS ===

@app.post("/chat/messages/", response_model=schemas.ChatMessage)
async def create_chat_message(
    message: schemas.ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    # Znajdź klienta
    db_client = db.query(models.Client).filter(models.Client.id == message.client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Sprawdź uprawnienia
    if current_user.role == models.UserRole.ADMIN:
        # Kosmetolog musi być przypisany do klienta
        if db_client.cosmetologist_id != current_user.id:
            raise HTTPException(status_code=403, detail="No permission for this client")
    else:
        # Klient może pisać tylko we własnym imieniu
        if db_client.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="You can only send messages as yourself")
        
        # Dla klienta, is_from_client musi być True
        if not message.is_from_client:
            raise HTTPException(status_code=400, detail="Clients can only send messages from themselves")
    
    # Utwórz wiadomość
    db_message = models.ChatMessage(
        client_id=message.client_id,
        sender_id=current_user.id,
        is_from_client=message.is_from_client,
        message=message.message
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@app.get("/chat/messages/{client_id}", response_model=List[schemas.ChatMessage])
async def read_chat_messages(
    client_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    # Znajdź klienta
    db_client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Sprawdź uprawnienia
    if current_user.role == models.UserRole.ADMIN:
        # Kosmetolog musi być przypisany do klienta
        if db_client.cosmetologist_id != current_user.id:
            raise HTTPException(status_code=403, detail="No permission for this client")
    else:
        # Klient może czytać tylko swoje wiadomości
        if db_client.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="You can only read your own messages")
    
    # Pobierz wiadomości
    messages = db.query(models.ChatMessage).filter(
        models.ChatMessage.client_id == client_id
    ).order_by(models.ChatMessage.sent_at.desc()).offset(skip).limit(limit).all()
    
    # Odwróć listę, aby najstarsze wiadomości były pierwsze
    messages.reverse()
    
    return messages

@app.put("/chat/messages/{message_id}/read", response_model=schemas.ChatMessage)
async def mark_message_as_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    # Znajdź wiadomość
    db_message = db.query(models.ChatMessage).filter(models.ChatMessage.id == message_id).first()
    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Znajdź klienta
    db_client = db.query(models.Client).filter(models.Client.id == db_message.client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Sprawdź uprawnienia
    if current_user.role == models.UserRole.ADMIN:
        # Kosmetolog musi być przypisany do klienta
        if db_client.cosmetologist_id != current_user.id:
            raise HTTPException(status_code=403, detail="No permission for this message")
        
        # Kosmetolog może oznaczać jako przeczytane tylko wiadomości od klienta
        if not db_message.is_from_client:
            raise HTTPException(status_code=400, detail="Can only mark client messages as read")
    else:
        # Klient może oznaczać jako przeczytane tylko wiadomości od kosmetologa
        if db_client.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="You can only read your own messages")
        
        # Klient może oznaczać jako przeczytane tylko wiadomości od kosmetologa
        if db_message.is_from_client:
            raise HTTPException(status_code=400, detail="Can only mark cosmetologist messages as read")
    
    # Oznacz jako przeczytane
    db_message.read_at = datetime.utcnow()
    db.commit()
    db.refresh(db_message)
    
    return db_message

# === PDF EXPORT ENDPOINT ===

@app.get("/care-plans/{care_plan_id}/pdf", response_class=StreamingResponse)
async def export_care_plan_to_pdf(
    care_plan_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    db_care_plan = db.query(models.CarePlan).filter(models.CarePlan.id == care_plan_id).first()
    if db_care_plan is None:
        raise HTTPException(status_code=404, detail="Care plan not found")
    
    # Sprawdź uprawnienia
    if current_user.role == models.UserRole.ADMIN:
        # Kosmetolog musi być przypisany do klienta
        client = db.query(models.Client).filter(models.Client.id == db_care_plan.client_id).first()
        if not client or client.cosmetologist_id != current_user.id:
            raise HTTPException(status_code=403, detail="No permission for this care plan")
    else:
        # Klient może zobaczyć tylko swoje plany
        client = db.query(models.Client).filter(models.Client.user_id == current_user.id).first()
        if not client or client.id != db_care_plan.client_id:
            raise HTTPException(status_code=403, detail="No permission for this care plan")
    
    # Załaduj dane potrzebne do generowania PDF
    care_plan_items = db.query(models.CarePlanItem).filter(
        models.CarePlanItem.care_plan_id == care_plan_id
    ).order_by(models.CarePlanItem.order).all()
    
    products = []
    for item in care_plan_items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        products.append({
            "item": item,
            "product": product
        })
    
    client = db.query(models.Client).filter(models.Client.id == db_care_plan.client_id).first()
    client_user = db.query(models.User).filter(models.User.id == client.user_id).first()
    analysis = db.query(models.Analysis).filter(models.Analysis.id == db_care_plan.analysis_id).first()
    
    # Tutaj powinien być kod generujący PDF
    # W rzeczywistej implementacji należy użyć biblioteki takiej jak ReportLab, WeasyPrint lub podobnej
    # Zwracamy tutaj tylko symulowaną odpowiedź
    
    # Symulacja generowania PDF
    content = f"""
    Plan pielęgnacyjny: {db_care_plan.title}
    
    Klientka: {client_user.full_name}
    Data utworzenia: {db_care_plan.created_at}
    Ważny do: {db_care_plan.valid_until}
    
    Opis planu: 
    {db_care_plan.description}
    
    Produkty:
    """
    
    for p in products:
        content += f"""
        - {p['product'].name} ({p['product'].brand})
          Czas stosowania: {p['item'].usage_time or 'Nie określono'}
          Częstotliwość: {p['item'].usage_frequency or 'Nie określono'}
          Instrukcje: {p['item'].usage_instructions or 'Brak szczegółowych instrukcji'}
        """
    
    content += f"""
    Analiza skóry:
    Typ skóry: {analysis.skin_type.value if analysis.skin_type else 'Nie określono'}
    Poziom nawilżenia: {analysis.hydration_level}%
    Poziom sebum: {analysis.sebum_level}%
    Przebarwienia: {analysis.pigmentation}%
    Zmarszczki: {analysis.wrinkles}%
    Pory: {analysis.pores}%
    Wrażliwość: {analysis.sensitivity}%
    
    Rekomendacje AI:
    {analysis.ai_recommendations or 'Brak rekomendacji AI'}
    
    ---
    BeautyAI - System wspierający kosmetologów w analizie skóry
    """
    
    # W rzeczywistej implementacji należałoby użyć biblioteki do generowania PDF
    # Tutaj zwracamy tylko tekst jako symulację
    
    # Symulacja odpowiedzi ze streamingiem pliku
    async def fake_pdf_streamer():
        yield content.encode()
    
    return StreamingResponse(
        fake_pdf_streamer(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=care_plan_{care_plan_id}.pdf"}
    )
